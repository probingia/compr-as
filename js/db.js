import { mostrarNotificacion } from './notifications.js';

const DB_NAME = 'Compr-As-DB';
const DB_VERSION = 2; // Incrementar versión por cambio de esquema
const STORES = ['productos', 'categorias', 'tiendas', 'listaAutocompletado', 'config', 'productoCategoriaMap'];

let db = null;

/**
 * Initializes the IndexedDB database and creates object stores if they don't exist.
 * @returns {Promise<IDBDatabase>} A promise that resolves with the database instance.
 */
export const initDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Error al abrir IndexedDB:', event.target.error);
      mostrarNotificacion('Error crítico: No se pudo abrir la base de datos. La aplicación no guardará cambios y podría no funcionar sin conexión.', 'error', 0);
      reject('Error al abrir la base de datos.');
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      console.log('Actualizando la base de datos IndexedDB...');
      const database = event.target.result;
      STORES.forEach(storeName => {
        if (!database.objectStoreNames.contains(storeName)) {
            if (['productos', 'categorias', 'tiendas'].includes(storeName)) {
                 database.createObjectStore(storeName, { keyPath: 'id' });
            } else {
                 database.createObjectStore(storeName);
            }
        }
      });
    };
  });
};

/**
 * Saves the entire application state to IndexedDB.
 * @param {object} state The application state to save.
 * @returns {Promise<void>}
 */
export const saveState = async (state) => {
  if (!db) await initDB();

  const transaction = db.transaction(STORES, 'readwrite');

  const syncStore = (storeName, items, idKey) => {
    const store = transaction.objectStore(storeName);
    const stateKeys = new Set(items.map(item => item[idKey]));

    const dbKeysRequest = store.getAllKeys();
    dbKeysRequest.onsuccess = () => {
      const dbKeys = new Set(dbKeysRequest.result);

      // Borrar los que ya no están en el estado
      dbKeys.forEach(dbKey => {
        if (!stateKeys.has(dbKey)) {
          store.delete(dbKey);
        }
      });

      // Añadir o actualizar los del estado
      items.forEach(item => {
        store.put(item);
      });
    };
  };

  syncStore('productos', state.productos, 'id');
  syncStore('categorias', Array.from(state.mapaCategorias.values()), 'id');
  syncStore('tiendas', Array.from(state.mapaTiendas.values()), 'id');

  // Para los que son un único array/objeto, clear y put sigue siendo sencillo y eficaz
  const autocompletadoStore = transaction.objectStore('listaAutocompletado');
  autocompletadoStore.clear();
  autocompletadoStore.put(state.listaAutocompletado || [], 'fullList');

  const mapStore = transaction.objectStore('productoCategoriaMap');
  mapStore.clear();
  mapStore.put(state.productoCategoriaMap || {}, 'fullMap');

  const configStore = transaction.objectStore('config');
  configStore.clear();
  const fontSize = document.documentElement.className || 'font-size-normal';
  configStore.put(fontSize, 'fontSize');

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onerror = (event) => {
      console.error('Error al guardar el estado en IndexedDB:', event.target.error);
      mostrarNotificacion('Error: No se pudieron guardar los cambios en la base de datos.', 'error');
      reject('Error al guardar el estado.');
    };
  });
};


/**
 * Loads the entire application state from IndexedDB.
 * @returns {Promise<object>} A promise that resolves with the loaded state.
 */
export const loadState = async () => {
  if (!db) await initDB();
  
  const state = {};
  const transaction = db.transaction(STORES, 'readonly');

  const promises = STORES.map(storeName => {
      return new Promise((resolve, reject) => {
          const store = transaction.objectStore(storeName);
          const request = store.getAll();
          request.onsuccess = () => {
              if (storeName === 'listaAutocompletado') {
                  resolve({ key: storeName, value: request.result[0] || [] });
              } else if (storeName === 'productoCategoriaMap') {
                  resolve({ key: storeName, value: request.result[0] || {} });
              } else if (storeName === 'config') {
                  const fontSizeResult = request.result[0];
                  resolve({ key: 'fontSize', value: fontSizeResult || 'font-size-normal' });
              } else {
                  resolve({ key: storeName, value: request.result });
              }
          };
          request.onerror = () => reject(`No se pudo leer la tienda: ${storeName}`);
      });
  });

  const results = await Promise.all(promises);
  
  results.forEach(result => {
      if (result.key === 'fontSize') {
          document.documentElement.className = result.value;
      } else {
          state[result.key] = result.value;
      }
  });

  // Asegurarse de que las propiedades del estado principal existan
  STORES.forEach(storeName => {
      if (!state[storeName] && storeName !== 'config') {
          state[storeName] = [];
      }
  });

  return state;
};