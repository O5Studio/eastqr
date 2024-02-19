'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "e442b2a900c0902602d570b29725e6c3",
"assets/AssetManifest.bin.json": "5e3309b9cddb2a0c4c66f27e0791de81",
"assets/AssetManifest.json": "6e686f658f0af2d2f8df6d88fc6d4680",
"assets/FontManifest.json": "5b8598e5a97e63aa43e4dbaffc18e316",
"assets/fonts/Anta-Regular.ttf": "08dc1c5893bfab96b496642e402e21fa",
"assets/fonts/Anton-Regular.ttf": "055c4df4e2f8c7a4d4675cdd8fa68da0",
"assets/fonts/MaterialIcons-Regular.otf": "b2cdc218263e8186ebac7b9b39cabb54",
"assets/fonts/Oswald.ttf": "ca399fd2286e6d1e50bd65bd950b33ef",
"assets/fonts/Poppins-Regular.ttf": "093ee89be9ede30383f39a899c485a82",
"assets/fonts/RobotoRegular.ttf": "8a36205bd9b83e03af0591a004bc97f4",
"assets/icons/ic_app.png": "5daf4bb8d87262e7e2c6fd0628c5bc11",
"assets/icons/ic_audiovideo.png": "c9d3f8e6c8229ebef2e7f850e5e05d11",
"assets/icons/ic_awareness.png": "3a70f7baeedc157b63db82f5eaef5f5e",
"assets/icons/ic_discount.png": "047b8e037a7d6b741604c1d863fa1ba7",
"assets/icons/ic_email.png": "79b04374fe667befc243f2e0bea05482",
"assets/icons/ic_events.png": "278991aa5d547c59601ed31f90a9765b",
"assets/icons/ic_feedback.png": "b9b04134e6a862137f06a657f2fb8bf0",
"assets/icons/ic_fileshare.png": "271056c149432e26ea4293e57d32f0bb",
"assets/icons/ic_hospital.png": "3c4cfbd6a8c27f50a59ade7213647bdc",
"assets/icons/ic_html5.png": "69ae2e07ca6f84cc4659e82fb5e7e450",
"assets/icons/ic_linkinbio.png": "5ba1413a39cd6c63bfda028f5ae9a9a2",
"assets/icons/ic_menu.png": "23dcccd588653379a1972c160e4bc949",
"assets/icons/ic_products.png": "4517673debde4c1b09081049c0044a39",
"assets/icons/ic_sorry.png": "093a91690945e70e35d15d8992982b25",
"assets/icons/ic_url.png": "b522d43685f7dc5a0c0c3c9296776ab8",
"assets/icons/ic_vcard.png": "6cef0154dd99279db6498021a70c4082",
"assets/images/im_loading.jpg": "e817a3aee96790fa0060e6788e11eb34",
"assets/images/im_loading1.jpg": "fa15ac8970c1f31c04d289964a6137e4",
"assets/images/im_url.jpg": "f9f36adc778c8969790b1b6469732a70",
"assets/NOTICES": "8c41b97019f3621486fa074be51d16bf",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/shaders/ink_sparkle.frag": "4096b5150bac93c41cbc9b45276bd90f",
"canvaskit/canvaskit.js": "eb8797020acdbdf96a12fb0405582c1b",
"canvaskit/canvaskit.wasm": "73584c1a3367e3eaf757647a8f5c5989",
"canvaskit/chromium/canvaskit.js": "0ae8bbcc58155679458a0f7a00f66873",
"canvaskit/chromium/canvaskit.wasm": "143af6ff368f9cd21c863bfa4274c406",
"canvaskit/skwasm.js": "87063acf45c5e1ab9565dcf06b0c18b8",
"canvaskit/skwasm.wasm": "2fc47c0a0c3c7af8542b601634fe9674",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"favicon.png": "0a5be797df792071e27fee99707806e2",
"flutter.js": "59a12ab9d00ae8f8096fffc417b6e84f",
"icons/Icon-192.png": "b4e9c1fbe2e59a75e075d4a87187be86",
"icons/Icon-512.png": "f3f528c4bce10cfa9a2c0e55e090d391",
"icons/Icon-maskable-192.png": "a0042314c1c3c1ffd793e83ddab8d86f",
"icons/Icon-maskable-512.png": "66eae12c18404f0d433a6e83e68e0cad",
"index.html": "b84129572ca953524f509b9158d374ca",
"/": "b84129572ca953524f509b9158d374ca",
"main.dart.js": "d36fa6f3f26933237ae754fd0752dbcb",
"manifest.json": "45ecebc3887c04397a2689e0d7416328",
"version.json": "dc2fbc6658453ead09f8dbcf0e5c80e5"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
