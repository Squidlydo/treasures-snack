<<<<<<< HEAD
// =============================================================================
// My Neighborhood Treasures - single-file Expo Snack build
// =============================================================================
// This project lives in a GitHub repo, imported into Snack via "Import Git
// repository". To update the app going forward: edit this file in your
// local repo folder (the one GitHub Desktop created), commit, and push -
// Snack automatically re-syncs from the repo, no copy/paste needed.
// NOTE: this file only uses plain ASCII characters on purpose - some
// copy/paste paths mangle special characters and truncate large files.
//
// CHANGES IN THIS ROUND:
//   - Restored 3 more physical retailers using your real store data:
//     Best Buy (#1413, 25525 Highway 290), Walmart (#5091, 26270
//     Northwest Fwy), and Academy Sports + Outdoors (store number not
//     available, so it's shown honestly as "N/A" rather than guessed).
//     None of their addresses matched an exact Census street-level
//     geocode (same frontage-road gap as Costco/Target before), so all
//     three fall back to their ZIP's center point, same as those two -
//     labeled "approximate" same as before. Since Best Buy/Walmart share
//     a ZIP with Target, and Academy Sports shares a ZIP with Costco,
//     each approximate pin gets a small deterministic visual nudge (a
//     few hundred feet, seeded by store name) so overlapping pins don't
//     hide each other on the map - this does NOT mean the location got
//     more precise, it's purely so both pins stay individually tappable.
//   - Added Amazon as an ONLINE-ONLY retailer - it doesn't fit this app's
//     physical-store design (no address, no aisle, no map pin), so its
//     deal cards show a "Ships to you" line instead of a store line, the
//     Locator tab shows an explanatory message instead of an empty map
//     when Amazon is selected, and its detail view links to the Amazon
//     listing instead of "Get Directions."
//   - Verified real input/output fields directly from each new retailer's
//     actual Apify Actor documentation (not generic guesses) and
//     pre-filled all 4 new Actor IDs: Best Buy (sovereigntaylor/bestbuy-
//     scraper, $0.004/product), Walmart (junipr/walmart-scraper, $1.30
//     per 1,000 - note: needs a residential proxy on Apify's free plan,
//     check its page if a run comes back empty), Academy Sports
//     (parseforge/academy-sports-outdoors-scraper, pay-per-event, has a
//     built-in clearance filter this app now uses automatically when
//     your search query contains "clearance"), and Amazon (junglee/
//     amazon-crawler, $3.00 per 1,000 - the flagship, Apify-maintained
//     Amazon Actor with 19K+ users, most trustworthy of the bunch).
// =============================================================================

import { useCallback, useContext, useEffect, useMemo, useRef, useState, createContext } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  TextInput,
  Pressable,
  Switch,
  Modal,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
  InputAccessoryView,
  Keyboard,
  Platform,
  Linking,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
=======
import './global.css';
import { StatusBar } from 'expo-status-bar';
>>>>>>> 5684b90b15059263a1890744bb55229814568d7f
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, PirataOne_400Regular } from '@expo-google-fonts/pirata-one';
import { View, ActivityIndicator } from 'react-native';

import { WatchlistProvider } from './src/context/WatchlistContext';
import { SettingsProvider } from './src/context/SettingsContext';
import DashboardScreen from './src/screens/DashboardScreen';
import LocatorScreen from './src/screens/LocatorScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import WatchlistScreen from './src/screens/WatchlistScreen';
import MerchantsScreen from './src/screens/MerchantsScreen';
import { colors } from './src/theme/colors';

<<<<<<< HEAD
// =============================================================================
// REAL STORE DATA (your Cypress, TX locations - not generated)
// =============================================================================
// Home Depot and Lowe's addresses matched an exact TIGER/Census street-level
// geocode. The other five sit on frontage-road address ranges the free
// Census geocoder doesn't have indexed, so those fall back to their ZIP
// code's center point - close, but not building-exact. Since Best Buy and
// Walmart share a ZIP with Target, and Academy Sports shares a ZIP with
// Costco, a small deterministic offset (seeded by store name) is added so
// overlapping pins stay individually tappable on the map - it does not
// imply extra precision, just visual separation.
const ZIP_CENTROIDS = {
  '77429': { latitude: 29.9766, longitude: -95.6358 },
  '77433': { latitude: 29.8836, longitude: -95.7025 },
};
function approxCoordFor(retailerName, zip) {
  const centroid = ZIP_CENTROIDS[zip];
  const seed = Array.from(retailerName).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const angle = (seed % 360) * (Math.PI / 180);
  const dist = 0.004; // roughly a quarter mile - just enough for separate, tappable pins
  return { latitude: centroid.latitude + Math.sin(angle) * dist, longitude: centroid.longitude + Math.cos(angle) * dist };
}
const HOME_STORES = {
  'Home Depot': { storeName: 'The Home Depot', storeNumber: '6586', address: '17928 Spring Cypress Rd, Cypress, TX 77429', latitude: 29.973292, longitude: -95.688102, locationSource: 'exact' },
  "Lowe's": { storeName: "Lowe's Home Improvement", storeNumber: '2371', address: '14128 Cypress Rosehill Rd, Cypress, TX 77429', latitude: 29.971480, longitude: -95.700039, locationSource: 'exact' },
  Costco: { storeName: 'Costco Wholesale', storeNumber: '1208', address: '26960 Northwest Fwy, Cypress, TX 77433', ...approxCoordFor('Costco', '77433'), locationSource: 'approximate' },
  Target: { storeName: 'Target', storeNumber: '1894', address: '25901 US-290, Cypress, TX 77429', ...approxCoordFor('Target', '77429'), locationSource: 'approximate' },
  'Best Buy': { storeName: 'Best Buy', storeNumber: '1413', address: '25525 Highway 290, Cypress, TX 77429', ...approxCoordFor('Best Buy', '77429'), locationSource: 'approximate' },
  Walmart: { storeName: 'Walmart Supercenter', storeNumber: '5091', address: '26270 Northwest Fwy, Cypress, TX 77429', ...approxCoordFor('Walmart', '77429'), locationSource: 'approximate' },
  'Academy Sports': { storeName: 'Academy Sports + Outdoors', storeNumber: 'N/A', address: '28616 U.S. 290, Cypress, TX 77433', ...approxCoordFor('Academy Sports', '77433'), locationSource: 'approximate' },
};
function haversineMiles(lat1, lon1, lat2, lon2) {
  if ([lat1, lon1, lat2, lon2].some((v) => typeof v !== 'number' || Number.isNaN(v))) return null;
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 3958.8; // Earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

// =============================================================================
// MOCK DATA
// =============================================================================
// Amazon is intentionally excluded from HOME_STORES above (and therefore
// from this list's store-pin logic) - it has no physical location.
const RETAILERS = ['Home Depot', "Lowe's", 'Costco', 'Target', 'Best Buy', 'Walmart', 'Academy Sports', 'Amazon'];
const DEAL_TYPES = { CLEARANCE: 'clearance', MARKDOWN: 'markdown', PRICE_ERROR: 'price_error' };
const DEAL_TYPE_LABEL = { clearance: 'Clearance', markdown: 'Markdown', price_error: 'Price Error' };

const NOW = Date.now();
const hoursAgo = (h) => new Date(NOW - h * 60 * 60 * 1000).toISOString();

// Fallback illustrative store name, used ONLY when a scanned barcode
// doesn't match a known retailer (so there's genuinely no real store to
// attach it to) - the store number is parsed out of this same string so
// it can never contradict itself the way the old generator did.
const STORE_NAMES = ['Neighborhood Market #4310', 'Store #1187', 'Store #0932'];
function extractStoreNumber(storeName) {
  const match = String(storeName).match(/#(\d+)/);
  return match ? match[1] : '----';
}
// Aisle/SKU are still illustrative - no public API, free or paid, exposes
// real in-store aisle placement. Store name/number/address come from your
// real HOME_STORES data whenever the retailer is known and has one.
function deriveStoreDetails(seedKey, retailer) {
  const seed = Array.from(String(seedKey)).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const aisleLetter = String.fromCharCode(65 + (seed % 12));
  const aisle = `${aisleLetter}${(seed % 20) + 1}`;
  const sku = `SKU-${100000 + (seed % 900000)}`;
  const home = HOME_STORES[retailer];
  if (home) {
    return { storeName: home.storeName, storeNumber: home.storeNumber, address: home.address, locationSource: home.locationSource, aisle, sku };
  }
  const storeName = STORE_NAMES[seed % STORE_NAMES.length];
  return { storeName, storeNumber: extractStoreNumber(storeName), address: null, locationSource: null, aisle, sku };
}

const rawMockDeals = [
  { id: 'd2', retailer: 'Home Depot', brand: 'RYOBI', title: '18V ONE+ Cordless Drill Kit', upc: '032888000234', imageUrl: 'https://picsum.photos/seed/drill2/600/600', originalPrice: 99.0, salePrice: 49.0, dealType: DEAL_TYPES.MARKDOWN, postedAt: hoursAgo(5) },
  { id: 'd2b', retailer: 'Home Depot', brand: 'Husky', title: '52 in. 18-Drawer Tool Chest Combo', upc: '032888004471', imageUrl: 'https://picsum.photos/seed/tools2b/600/600', originalPrice: 598.0, salePrice: 249.0, dealType: DEAL_TYPES.CLEARANCE, postedAt: hoursAgo(16) },
  { id: 'd3', retailer: "Lowe's", brand: 'allen + roth', title: 'Outdoor Patio Sectional Cover', upc: '051788000456', imageUrl: 'https://picsum.photos/seed/patio3/600/600', originalPrice: 64.98, salePrice: 12.5, dealType: DEAL_TYPES.CLEARANCE, postedAt: hoursAgo(9) },
  { id: 'd3b', retailer: "Lowe's", brand: 'Kobalt', title: '232-Piece Mechanics Tool Set', upc: '051788009911', imageUrl: 'https://picsum.photos/seed/mechtools3b/600/600', originalPrice: 199.0, salePrice: 89.0, dealType: DEAL_TYPES.MARKDOWN, postedAt: hoursAgo(22) },
  { id: 'd4c', retailer: 'Costco', brand: 'Kirkland Signature', title: '2-Pack Memory Foam Pillows', upc: '096619000112', imageUrl: 'https://picsum.photos/seed/pillow4c/600/600', originalPrice: 39.99, salePrice: 24.99, dealType: DEAL_TYPES.MARKDOWN, postedAt: hoursAgo(6) },
  { id: 'd4d', retailer: 'Costco', brand: 'Ninja', title: 'Foodi 14-in-1 Pressure Cooker & Air Fryer', upc: '096619005567', imageUrl: 'https://picsum.photos/seed/ninja4d/600/600', originalPrice: 229.99, salePrice: 149.99, dealType: DEAL_TYPES.PRICE_ERROR, postedAt: hoursAgo(1.5) },
  { id: 'd4', retailer: 'Target', brand: 'Threshold', title: 'Ceramic Table Lamp, Aqua Glaze', upc: '085239000789', imageUrl: 'https://picsum.photos/seed/lamp4/600/600', originalPrice: 45.0, salePrice: 9.0, dealType: DEAL_TYPES.CLEARANCE, postedAt: hoursAgo(1) },
  { id: 'd8', retailer: 'Target', brand: 'Cat & Jack', title: 'Kids Rain Boots, Assorted Sizes', upc: '085239001122', imageUrl: 'https://picsum.photos/seed/boots8/600/600', originalPrice: 19.99, salePrice: 4.0, dealType: DEAL_TYPES.CLEARANCE, postedAt: hoursAgo(30) },
  { id: 'd5', retailer: 'Best Buy', brand: 'Samsung', title: '55" QLED 4K Smart TV', upc: '887276543210', imageUrl: 'https://picsum.photos/seed/tv5/600/600', originalPrice: 799.99, salePrice: 449.99, dealType: DEAL_TYPES.CLEARANCE, postedAt: hoursAgo(3) },
  { id: 'd5b', retailer: 'Best Buy', brand: 'Bose', title: 'QuietComfort Wireless Headphones', upc: '017817827094', imageUrl: 'https://picsum.photos/seed/headphones5b/600/600', originalPrice: 349.0, salePrice: 199.0, dealType: DEAL_TYPES.MARKDOWN, postedAt: hoursAgo(11) },
  { id: 'd6', retailer: 'Walmart', brand: 'Hamilton Beach', title: '6-Qt Programmable Slow Cooker', upc: '040094402070', imageUrl: 'https://picsum.photos/seed/slowcooker6/600/600', originalPrice: 39.88, salePrice: 19.0, dealType: DEAL_TYPES.CLEARANCE, postedAt: hoursAgo(14) },
  { id: 'd6b', retailer: 'Walmart', brand: 'Mainstays', title: '5-Shelf Bookcase, Multiple Finishes', upc: '048420100001', imageUrl: 'https://picsum.photos/seed/bookcase6b/600/600', originalPrice: 44.98, salePrice: 22.0, dealType: DEAL_TYPES.MARKDOWN, postedAt: hoursAgo(20) },
  { id: 'd7', retailer: 'Academy Sports', brand: 'Magellan Outdoors', title: '2-Person Dome Tent', upc: '888345671234', imageUrl: 'https://picsum.photos/seed/tent7/600/600', originalPrice: 59.99, salePrice: 29.99, dealType: DEAL_TYPES.CLEARANCE, postedAt: hoursAgo(8) },
  { id: 'd7b', retailer: 'Academy Sports', brand: 'Nike', title: "Men's Revolution 7 Running Shoes", upc: '195867423810', imageUrl: 'https://picsum.photos/seed/shoes7b/600/600', originalPrice: 65.0, salePrice: 39.0, dealType: DEAL_TYPES.MARKDOWN, postedAt: hoursAgo(26) },
  { id: 'd9', retailer: 'Amazon', brand: 'Anker', title: 'PowerCore 10000 Portable Charger', upc: '848061073823', imageUrl: 'https://picsum.photos/seed/anker9/600/600', originalPrice: 25.99, salePrice: 15.99, dealType: DEAL_TYPES.MARKDOWN, postedAt: hoursAgo(4) },
  { id: 'd9b', retailer: 'Amazon', brand: 'Instant Pot', title: 'Duo 7-in-1 Electric Pressure Cooker', upc: '854399006979', imageUrl: 'https://picsum.photos/seed/instantpot9b/600/600', originalPrice: 99.95, salePrice: 69.0, dealType: DEAL_TYPES.PRICE_ERROR, postedAt: hoursAgo(2) },
];
// Amazon has no physical store, so its sample deals skip HOME_STORES
// entirely and are flagged isOnline instead of getting a store/aisle.
const mockDeals = rawMockDeals.map((d) => {
  if (d.retailer === 'Amazon') {
    const seed = Array.from(String(d.id)).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return { ...d, storeName: null, storeNumber: null, address: null, locationSource: null, aisle: null, sku: `ASIN-${100000 + (seed % 900000)}`, isSample: true, isOnline: true };
  }
  return { ...d, ...deriveStoreDetails(d.id, d.retailer), isSample: true, isOnline: false };
});

// Real stores to show on the map for whichever merchant(s) are selected,
// with a genuine straight-line distance computed from your phone's actual
// coordinates to each store's real address. Amazon is automatically
// excluded since it isn't in HOME_STORES.
function nearbyRealStores(latitude, longitude, retailer) {
  const names = retailer && retailer !== 'All' ? [retailer] : Object.keys(HOME_STORES);
  return names
    .filter((name) => HOME_STORES[name])
    .map((name) => {
      const home = HOME_STORES[name];
      const seed = Array.from(name).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      return {
        id: `home-${name}`,
        retailer: name,
        storeName: home.storeName,
        storeNumber: home.storeNumber,
        address: home.address,
        locationSource: home.locationSource,
        latitude: home.latitude,
        longitude: home.longitude,
        distanceMiles: haversineMiles(latitude, longitude, home.latitude, home.longitude),
        // No live inventory API is wired up, so this stays a clearly
        // simulated number rather than pretending to be a real stock feed.
        stockCount: seed % 9,
      };
    });
}

// Simulates checking OTHER locations of the SAME chain for a given
// UPC/SKU near a ZIP code - separate from the always-accurate HOME_STORES
// pin/detail above. The point: if your one confirmed store is sold out,
// the same item can often still be found at another location of the same
// retailer. None of these retailers expose a free live nationwide
// inventory API, so these results are clearly labeled "simulated" rather
// than presented as real-time stock.
function mockStoresForZip(zip, upcOrSku, retailer) {
  const seed = Array.from(`${zip}-${upcOrSku}-${retailer}`).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const home = HOME_STORES[retailer];
  const numbers = [home?.storeNumber, String(1000 + (seed % 8000)), String(2000 + (seed % 7000)), String(3000 + (seed % 6000))].filter(Boolean);
  return numbers.slice(0, 3).map((num, i) => {
    const rand = (seed * (i + 7)) % 97;
    return {
      id: `${zip}-${retailer}-${i}`,
      storeName: home?.storeName || retailer,
      storeNumber: num,
      distanceMiles: +(1.2 + (rand % 14)).toFixed(1),
      stockCount: rand % 9,
      price: +(9.99 + (rand % 40)).toFixed(2),
    };
  });
}
async function getLocalStock(zip, upcOrSku, retailer) {
  await delay(400);
  if (!zip || !upcOrSku) throw new Error('Enter both a ZIP code and a UPC/SKU.');
  if (!retailer || retailer === 'All') throw new Error('Pick a specific merchant on the Dashboard first.');
  return mockStoresForZip(zip, upcOrSku, retailer);
}

// merchant metadata - none of these 8 retailers has an official public
// API, so the only way to get real deal data is a paid third-party
// source. Apify Store hosts independently-built scraper "Actors" for all
// of them, priced per-result (pay for what you use) rather than a flat
// monthly subscription. Apify's free plan includes $5/month of usage
// credit with no credit card required - light personal use may cost
// nothing at all.
//
// For every retailer below except Lowe's, I read a specific Actor's own
// documented input/output fields directly (not a guess), and the code in
// fetchApifyActorDeals sends/reads those exact field names - so those
// Actor IDs are pre-filled for you already. Lowe's is left blank on
// purpose: a documentation fetch for the leading Lowe's candidate timed
// out in an earlier session, so I couldn't verify its real fields, and
// pre-filling one anyway would be a guess dressed up as a fact.
const DEFAULT_ACTOR_IDS = {
  'Home Depot': 'cirkit~home-depot-product-scraper',
  Target: 'elliotpadfield~target-scraper',
  Costco: 'sian.agency~costco-data-scraper',
  'Best Buy': 'sovereigntaylor~bestbuy-scraper',
  Walmart: 'junipr~walmart-scraper',
  'Academy Sports': 'parseforge~academy-sports-outdoors-scraper',
  Amazon: 'junglee~amazon-crawler',
};
const HOME_DEPOT_NOTE = "Pre-filled with cirkit/home-depot-product-scraper ($3.50 per 1,000 results) - its real input/output fields are verified and matched in this app's code. Caveat: that Actor currently shows an \"Under maintenance\" badge on its own Apify page - check its status before relying on it, or browse apify.com/store and search \"home depot\" for an alternative if it stops responding.";
const LOWES_NOTE = "No Lowe's Actor ID is pre-filled - a documentation fetch for the leading candidate timed out, so its real field names are unverified. Browse apify.com/store, search \"lowes\", pick one (studio-amba/lowes-scraper is a reasonable starting point but untested here), open its own \"Input\" and \"Output\" tabs to see its real field names, and paste its Actor ID below (use ~ in place of the / ).";
const COSTCO_NOTE = 'Pre-filled with sian.agency/costco-data-scraper ($0.90 per 1,000 rows) - its real input/output fields are verified and matched in this app\'s code.';
const TARGET_NOTE = 'Pre-filled with elliotpadfield/target-scraper ($2.50 per 1,000 results) - its real input/output fields are verified and matched in this app\'s code.';
const BESTBUY_NOTE = "Pre-filled with sovereigntaylor/bestbuy-scraper ($0.004 per product, pay-per-event) - its real input/output fields are verified and matched in this app's code.";
const WALMART_NOTE = "Pre-filled with junipr/walmart-scraper ($1.30 per 1,000 products, pay-per-event) - its real input/output fields are verified and matched in this app's code. Note: this Actor needs a residential proxy on Apify's free plan for reliable results - check its page if a run comes back empty.";
const ACADEMY_NOTE = "Pre-filled with parseforge/academy-sports-outdoors-scraper (pay-per-event; the $5 free credit covers roughly your first 100 results) - its real input/output fields are verified and matched in this app's code. It has a built-in clearance filter this app turns on automatically when your search query contains the word \"clearance\".";
const AMAZON_NOTE = "Pre-filled with junglee/amazon-crawler ($3.00 per 1,000 results) - the flagship, Apify-maintained Amazon Actor with 19,000+ users, the most established of any Actor in this app. Amazon has no physical stores, so this retailer's deals show no map pin or aisle - just price, photo, and a link to the listing.";
const MERCHANTS = {
  'Home Depot': { availablePlans: ['mock', 'paid'], paid: { label: 'Apify Actor (pay-per-result)', signupUrl: 'https://apify.com/cirkit/home-depot-product-scraper', notes: HOME_DEPOT_NOTE, fields: [{ key: 'apiKey', label: 'Apify API token (same token works for all stores)' }, { key: 'apiBaseUrl', label: 'Actor ID' }, { key: 'apiSecret', label: 'Search query to check (e.g. clearance)' }] } },
  "Lowe's": { availablePlans: ['mock', 'paid'], paid: { label: 'Apify Actor (pay-per-result)', signupUrl: 'https://apify.com/store?search=lowes', notes: LOWES_NOTE, fields: [{ key: 'apiKey', label: 'Apify API token (same token works for all stores)' }, { key: 'apiBaseUrl', label: 'Actor ID (e.g. studio-amba~lowes-scraper)' }, { key: 'apiSecret', label: 'Search query to check (e.g. clearance)' }] } },
  Costco: { availablePlans: ['mock', 'paid'], paid: { label: 'Apify Actor (pay-per-result)', signupUrl: 'https://apify.com/sian.agency/costco-data-scraper', notes: COSTCO_NOTE, fields: [{ key: 'apiKey', label: 'Apify API token (same token works for all stores)' }, { key: 'apiBaseUrl', label: 'Actor ID' }, { key: 'apiSecret', label: 'Search query to check (e.g. clearance)' }] } },
  Target: { availablePlans: ['mock', 'paid'], paid: { label: 'Apify Actor (pay-per-result)', signupUrl: 'https://apify.com/elliotpadfield/target-scraper', notes: TARGET_NOTE, fields: [{ key: 'apiKey', label: 'Apify API token (same token works for all stores)' }, { key: 'apiBaseUrl', label: 'Actor ID' }, { key: 'apiSecret', label: 'Search query to check (e.g. clearance)' }] } },
  'Best Buy': { availablePlans: ['mock', 'paid'], paid: { label: 'Apify Actor (pay-per-result)', signupUrl: 'https://apify.com/sovereigntaylor/bestbuy-scraper', notes: BESTBUY_NOTE, fields: [{ key: 'apiKey', label: 'Apify API token (same token works for all stores)' }, { key: 'apiBaseUrl', label: 'Actor ID' }, { key: 'apiSecret', label: 'Search query to check (e.g. clearance)' }] } },
  Walmart: { availablePlans: ['mock', 'paid'], paid: { label: 'Apify Actor (pay-per-result)', signupUrl: 'https://apify.com/junipr/walmart-scraper', notes: WALMART_NOTE, fields: [{ key: 'apiKey', label: 'Apify API token (same token works for all stores)' }, { key: 'apiBaseUrl', label: 'Actor ID' }, { key: 'apiSecret', label: 'Search query to check (e.g. clearance)' }] } },
  'Academy Sports': { availablePlans: ['mock', 'paid'], paid: { label: 'Apify Actor (pay-per-result)', signupUrl: 'https://apify.com/parseforge/academy-sports-outdoors-scraper', notes: ACADEMY_NOTE, fields: [{ key: 'apiKey', label: 'Apify API token (same token works for all stores)' }, { key: 'apiBaseUrl', label: 'Actor ID' }, { key: 'apiSecret', label: 'Search query to check (e.g. clearance)' }] } },
  Amazon: { availablePlans: ['mock', 'paid'], paid: { label: 'Apify Actor (pay-per-result)', signupUrl: 'https://apify.com/junglee/amazon-crawler', notes: AMAZON_NOTE, fields: [{ key: 'apiKey', label: 'Apify API token (same token works for all stores)' }, { key: 'apiBaseUrl', label: 'Actor ID' }, { key: 'apiSecret', label: 'Search query to check (e.g. clearance)' }] } },
};
function getMerchantInfo(name) {
  return MERCHANTS[name] || { availablePlans: ['mock'], notes: '' };
}

// =============================================================================
// FORMAT HELPERS
// =============================================================================
function formatMoney(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '--';
  return `$${Number(n).toFixed(2)}`;
}
function discountPercent(original, sale) {
  if (!original || original <= 0) return 0;
  return Math.round(((original - sale) / original) * 100);
}
function formatRelativeTime(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
function buildDealDescription(deal) {
  const pct = discountPercent(deal.originalPrice, deal.salePrice);
  if (deal.isOnline) {
    return `Sold online at ${deal.retailer} - no physical store, ships to your address. SKU/ASIN ${deal.sku}. Originally ${formatMoney(deal.originalPrice)}, now marked down to ${formatMoney(deal.salePrice)} - ${pct}% off treasure!`;
  }
  const addressLine = deal.address ? ` - ${deal.address}` : '';
  const approxNote = deal.locationSource === 'approximate' ? ' (approximate location - see Locator tab)' : '';
  return `Spotted at ${deal.storeName}, store #${deal.storeNumber}${addressLine}${approxNote}, aisle ${deal.aisle}. SKU ${deal.sku}. Originally ${formatMoney(deal.originalPrice)}, now marked down to ${formatMoney(deal.salePrice)} - ${pct}% off treasure!`;
}

// =============================================================================
// NOTIFICATIONS (local only - see README notes on Expo Go limitations)
// =============================================================================
Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: false, shouldSetBadge: false, shouldShowBanner: true, shouldShowList: true }),
});
async function ensureNotificationPermission() {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}
async function notifyPriceAlert({ title, body }) {
  try {
    const ok = await ensureNotificationPermission();
    if (!ok) return;
    await Notifications.scheduleNotificationAsync({ content: { title, body, sound: false }, trigger: null });
  } catch (e) {
    console.warn('Failed to send local notification', e);
  }
}

// =============================================================================
// DATA LAYER (mock by default; a retailer goes live once its Apify Actor ID
// + API token + search query are filled in on the Merchants tab)
// =============================================================================
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// Calls an Apify Actor's "run and return dataset items" endpoint. Amazon's
// Actor (junglee/amazon-crawler) takes real Amazon URLs rather than a
// keyword, and returns a different shape (nested price objects, ASIN
// instead of UPC), so it gets its own input/output handling. Every other
// retailer's pre-filled Actor is a search-style scraper, so one shared
// input body/output mapping covers Home Depot, Lowe's, Costco, Target,
// Best Buy, Walmart, and Academy Sports - it sends every field name any
// of those Actors' own docs said they expect (harmless: an Actor just
// ignores fields it doesn't recognize) and reads their output defensively.
async function fetchApifyActorDeals(retailer, { apiBaseUrl, apiKey, apiSecret }) {
  const actorId = (apiBaseUrl || '').trim();
  const token = (apiKey || '').trim();
  if (!actorId || !token) return [];
  const query = (apiSecret || '').trim() || 'clearance';
  const home = HOME_STORES[retailer];
  const zipMatch = home ? home.address.match(/\d{5}/) : null;
  const homeZip = zipMatch ? zipMatch[0] : undefined;

  let body;
  if (retailer === 'Amazon') {
    // junglee/amazon-crawler expects real Amazon URLs, not a keyword - a
    // standard Amazon search URL built from the query works as one.
    body = {
      categoryOrProductUrls: [{ url: `https://www.amazon.com/s?k=${encodeURIComponent(query)}` }],
      maxItemsPerStartUrl: 20,
      zipCode: homeZip,
      countryCode: 'US',
    };
  } else {
    body = {
      query,
      search: query,
      keyword: query,
      searchQuery: query,
      keywords: [query],
      searchQueries: [query],
      queries: [query],
      searchTerms: [query],
      operation: 'search',
      maxPages: 1,
      maxItems: 20,
      maxProducts: 20,
      maxProductsPerQuery: 20,
      maxResults: 20,
      clearanceOnly: /clearance/i.test(query),
      storeId: home ? home.storeNumber : undefined,
      zipCode: homeZip,
      zip: homeZip,
      state: 'TX',
      enrichPDP: true,
      includeProductDetails: true,
      fetchProductDetails: true,
    };
  }

  const url = `https://api.apify.com/v2/acts/${encodeURIComponent(actorId)}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${retailer} Apify Actor responded ${res.status}`);
  const items = await res.json();
  if (!Array.isArray(items)) return [];
  return items.slice(0, 20).map((item, i) => {
    let title, brand, salePrice, originalPrice, imageUrl, upc;
    if (retailer === 'Amazon') {
      title = item.title || 'Unknown product';
      brand = item.brand || retailer;
      salePrice = Number(item.price?.value ?? 0);
      originalPrice = Number(item.listPrice?.value ?? salePrice);
      imageUrl = item.thumbnailImage || (Array.isArray(item.images) ? item.images[0] : null) || null;
      upc = String(item.asin || '');
    } else {
      title = item.itemName || item.title || item.name || item.productName || 'Unknown product';
      brand = (Array.isArray(item.brand) ? item.brand[0] : item.brand) || retailer;
      salePrice = Number(item.salePrice ?? item.price ?? item.currentPrice ?? 0);
      originalPrice = Number(item.listPrice ?? item.originalPrice ?? item.wasPrice ?? item.regularPrice ?? item.price ?? salePrice);
      imageUrl = item.image || item.imageUrl || (Array.isArray(item.images) ? item.images[0] : null) || (Array.isArray(item.allImages) ? item.allImages[0] : null) || (Array.isArray(item.alternateImages) ? item.alternateImages[0] : null) || item.thumbnail || null;
      upc = String((Array.isArray(item.skus) ? item.skus[0] : null) || item.upc || item.gtin || item.itemNumber || item.itemId || item.tcin || item.sku || item.productId || '');
    }
    const isOnline = retailer === 'Amazon';
    const storeFields = isOnline
      ? { storeName: null, storeNumber: null, address: null, locationSource: null, aisle: null, sku: upc, url: item.url || null }
      : deriveStoreDetails(`${retailer}-${upc || i}`, retailer);
    return {
      id: `${retailer}-apify-${i}`,
      retailer,
      brand,
      title,
      upc,
      imageUrl,
      originalPrice,
      salePrice,
      dealType: originalPrice > salePrice ? 'markdown' : 'clearance',
      postedAt: new Date().toISOString(),
      isSample: false,
      isOnline,
      ...storeFields,
    };
  });
}

// Best-effort real photo lookup for the built-in SAMPLE deals. Honest
// caveat: the sample deals' UPCs were invented by me to look realistic,
// not real registered barcodes, so this will very likely keep finding no
// match for them specifically - that's expected, not a bug. This same
// lookup machinery is what actually matters once a retailer goes live
// with real Apify data, since live data already carries its own real
// photo and never needs this fallback. Results are cached in memory so
// the same UPC is never looked up twice in one app session (kind to the
// free trial API's daily rate limit).
const realPhotoCache = new Map();
async function tryRealPhotoForUpc(upc) {
  if (!upc) return null;
  if (realPhotoCache.has(upc)) return realPhotoCache.get(upc);
  try {
    const res = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${encodeURIComponent(upc)}`);
    const json = await res.json();
    const photo = json.items?.[0]?.images?.[0] || null;
    realPhotoCache.set(upc, photo);
    return photo;
  } catch (e) {
    realPhotoCache.set(upc, null);
    return null;
  }
}
async function enrichWithRealPhotos(deals) {
  return Promise.all(
    deals.map(async (d) => {
      if (!d.isSample) return d; // live Apify deals already carry a real photo
      const realPhoto = await tryRealPhotoForUpc(d.upc);
      if (realPhoto) return { ...d, imageUrl: realPhoto, isSample: false, photoVerified: true };
      return d;
    })
  );
}

async function getDeals({ retailer, merchantSettings } = {}) {
  await delay(400);
  const settings = merchantSettings || {};
  const enabledRetailers = Object.keys(settings).filter((r) => settings[r]?.enabled !== false);
  const wantAll = !retailer || retailer === 'All';
  const liveResults = [];
  const liveErrors = [];
  const targets = wantAll ? Object.keys(settings) : [retailer];
  for (const r of targets) {
    const cfg = settings[r];
    if (!cfg || cfg.enabled === false) continue;
    if (cfg.plan === 'paid' && cfg.apiBaseUrl && cfg.apiKey) {
      try {
        liveResults.push(...(await fetchApifyActorDeals(r, cfg)));
      } catch (e) {
        console.warn(`Live fetch failed for ${r}, falling back to mock:`, e.message);
        liveErrors.push(r);
      }
    }
  }
  // A retailer's mock deals only show if it ISN'T on a working live plan -
  // this check applies consistently whether "All" or a single retailer is
  // selected, so a single-retailer view never stacks live + sample deals.
  const mockForRest = mockDeals.filter((d) => {
    if (enabledRetailers.length && !enabledRetailers.includes(d.retailer)) return false;
    if (!wantAll && d.retailer !== retailer) return false;
    const cfg = settings[d.retailer];
    const isLive = cfg && cfg.plan === 'paid' && cfg.apiBaseUrl && cfg.apiKey;
    return !isLive || liveErrors.includes(d.retailer);
  });
  const enriched = await enrichWithRealPhotos([...liveResults, ...mockForRest]);
  return enriched.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
}
async function geocodeZip(zip) {
  const res = await fetch(`https://api.zippopotam.us/us/${encodeURIComponent(zip)}`);
  if (!res.ok) throw new Error('ZIP not found. Double-check the 5-digit code.');
  const data = await res.json();
  const place = data.places?.[0];
  if (!place) throw new Error('No location data for that ZIP.');
  return { zip: data['post code'], city: place['place name'], state: place['state abbreviation'], latitude: parseFloat(place.latitude), longitude: parseFloat(place.longitude) };
}
async function lookupUpc(upc) {
  const known = mockDeals.find((d) => d.upc === upc);
  if (known) return { source: 'known_deal', ...known };
  try {
    const res = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${encodeURIComponent(upc)}`);
    const json = await res.json();
    const item = json.items?.[0];
    if (item) {
      return {
        source: 'upcitemdb',
        upc,
        brand: item.brand || 'Unknown brand',
        title: item.title || 'Unknown product',
        imageUrl: item.images?.[0] || null,
        lowestRecordedPrice: item.lowest_recorded_price || null,
        highestRecordedPrice: item.highest_recorded_price || null,
        // No retailer is known for an arbitrary scanned barcode that isn't
        // one of our sample deals, so there's no real store to attach -
        // storeName/storeNumber are left unset rather than guessing one.
      };
    }
  } catch (e) {
    console.warn('UPCitemdb lookup failed, falling back to mock:', e.message);
  }
  return {
    source: 'mock_fallback',
    upc,
    brand: 'Unrecognized item',
    title: 'No price-drop record found for this barcode yet',
    imageUrl: null,
    lowestRecordedPrice: null,
    highestRecordedPrice: null,
  };
}

// =============================================================================
// CONTEXTS
// =============================================================================
const WatchlistContext = createContext(null);
const WATCHLIST_KEY = '@mnt/watchlist';
const AUTO_CHECK_INTERVAL_MS = 90 * 1000;

// Cleans up whatever was saved before this update: fills in missing store
// info (using the real HOME_STORES data when the item's retailer is
// known), collapses duplicate entries for the same item, and makes sure
// every item has a persisted "alerted" flag so already-notified items
// don't fire again after a reload.
function migrateWatchlistItems(rawItems) {
  const seenTitles = new Set();
  const migrated = [];
  for (const item of Array.isArray(rawItems) ? rawItems : []) {
    const title = (item && item.title ? String(item.title) : '').trim();
    if (!title) continue;
    const normalized = title.toLowerCase();
    if (seenTitles.has(normalized)) continue;
    seenTitles.add(normalized);
    const retailer = item.retailer || 'All';
    const hasStore = item.storeName && item.storeNumber;
    const fallbackStore = hasStore ? null : deriveStoreDetails(title, retailer);
    const targetPrice = Number(item.targetPrice);
    const currentPrice = Number(item.currentPrice);
    const safeTarget = Number.isFinite(targetPrice) ? targetPrice : 0;
    const safeCurrent = Number.isFinite(currentPrice) ? currentPrice : safeTarget;
    const alreadyHit = safeCurrent <= safeTarget;
    migrated.push({
      id: item.id || `w-${Date.now()}-${migrated.length}`,
      title,
      retailer,
      storeName: hasStore ? item.storeName : fallbackStore.storeName,
      storeNumber: hasStore ? item.storeNumber : fallbackStore.storeNumber,
      storeAddress: item.storeAddress || (fallbackStore ? fallbackStore.address : null),
      targetPrice: safeTarget,
      currentPrice: safeCurrent,
      alerted: typeof item.alerted === 'boolean' ? item.alerted : alreadyHit,
      createdAt: item.createdAt || new Date().toISOString(),
    });
  }
  return migrated;
}

function WatchlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(WATCHLIST_KEY);
        if (raw) {
          const migrated = migrateWatchlistItems(JSON.parse(raw));
          setItems(migrated);
          // Save the cleaned-up version right away so duplicates/missing
          // store info from an older version of the app don't reappear.
          AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(migrated)).catch(() => {});
        }
      } catch (e) {
        console.warn('Failed to load watchlist', e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(items)).catch((e) => console.warn('Failed to save watchlist', e));
  }, [items, loaded]);

  const isWatched = useCallback((title) => {
    const normalized = (title || '').trim().toLowerCase();
    return items.some((i) => i.title.trim().toLowerCase() === normalized);
  }, [items]);

  const addItem = useCallback((item) => {
    setItems((prev) => {
      const normalized = (item.title || '').trim().toLowerCase();
      if (prev.some((i) => i.title.trim().toLowerCase() === normalized)) return prev; // avoid duplicates
      const retailer = item.retailer || 'All';
      const fallbackStore = item.storeName && item.storeNumber ? null : deriveStoreDetails(item.title || normalized, retailer);
      return [
        {
          id: `w-${Date.now()}`,
          title: item.title,
          retailer,
          storeName: item.storeName || (fallbackStore ? fallbackStore.storeName : null),
          storeNumber: item.storeNumber || (fallbackStore ? fallbackStore.storeNumber : null),
          storeAddress: item.storeAddress || (fallbackStore ? fallbackStore.address : null),
          targetPrice: Number(item.targetPrice),
          currentPrice: Number(item.targetPrice) * (1.15 + Math.random() * 0.5),
          alerted: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });
  }, []);
  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);
  // Simulates a price check. Notifies AT MOST ONCE per item - the
  // "alerted" flag lives on the item itself and is persisted, so it
  // survives app reloads instead of resetting and re-firing.
  const refreshPrices = useCallback(() => {
    setItems((prev) =>
      prev.map((item) => {
        const drift = (Math.random() - 0.6) * 0.25;
        const next = Math.max(0.5, item.currentPrice * (1 + drift));
        const updated = { ...item, currentPrice: +next.toFixed(2) };
        const justHitTarget = updated.currentPrice <= updated.targetPrice;
        if (justHitTarget && !updated.alerted) {
          updated.alerted = true;
          const storeInfo = updated.storeName ? ` at ${updated.storeName} #${updated.storeNumber}${updated.storeAddress ? ', ' + updated.storeAddress : ''}` : '';
          notifyPriceAlert({
            title: 'Price alert!',
            body: `${updated.title} dropped to $${updated.currentPrice.toFixed(2)} (target $${updated.targetPrice.toFixed(2)})${storeInfo}`,
          });
        }
        return updated;
      })
    );
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const id = setInterval(refreshPrices, AUTO_CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, [loaded, refreshPrices]);

  const value = useMemo(() => ({ items, addItem, removeItem, refreshPrices, isWatched, loaded }), [items, addItem, removeItem, refreshPrices, isWatched, loaded]);
  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}
function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be used inside a WatchlistProvider');
  return ctx;
}

const SettingsContext = createContext(null);
const SETTINGS_KEY = '@mnt/merchant-settings';
function defaultSettings() {
  const s = {};
  RETAILERS.forEach((name) => {
    s[name] = { enabled: true, plan: 'mock', apiKey: '', apiSecret: 'clearance', apiBaseUrl: DEFAULT_ACTOR_IDS[name] || '' };
  });
  return s;
}
function SettingsProvider({ children }) {
  const [merchants, setMerchants] = useState(defaultSettings());
  const [notifyEnabled, setNotifyEnabled] = useState(true);
  const [selectedMerchant, setSelectedMerchant] = useState('All');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(SETTINGS_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          // Only keep saved settings for retailers that still exist, and
          // merge saved values over fresh defaults - but treat an empty
          // saved string as "never set" rather than "intentionally
          // blanked". Otherwise an empty Actor ID saved by an earlier
          // version of this app would permanently block today's newly
          // pre-filled default from ever showing up.
          const cleanedMerchants = {};
          RETAILERS.forEach((name) => {
            const base = defaultSettings()[name];
            const saved = parsed.merchants ? parsed.merchants[name] : null;
            cleanedMerchants[name] = saved
              ? {
                  enabled: typeof saved.enabled === 'boolean' ? saved.enabled : base.enabled,
                  plan: saved.plan || base.plan,
                  apiKey: saved.apiKey || base.apiKey,
                  apiSecret: saved.apiSecret || base.apiSecret,
                  apiBaseUrl: saved.apiBaseUrl || base.apiBaseUrl,
                }
              : base;
          });
          setMerchants(cleanedMerchants);
          if (typeof parsed.notifyEnabled === 'boolean') setNotifyEnabled(parsed.notifyEnabled);
          if (parsed.selectedMerchant && (parsed.selectedMerchant === 'All' || RETAILERS.includes(parsed.selectedMerchant))) {
            setSelectedMerchant(parsed.selectedMerchant);
          }
        }
      } catch (e) {
        console.warn('Failed to load settings', e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({ merchants, notifyEnabled, selectedMerchant })).catch((e) => console.warn('Failed to save settings', e));
  }, [merchants, notifyEnabled, selectedMerchant, loaded]);

  const updateMerchant = useCallback((name, patch) => {
    setMerchants((prev) => ({ ...prev, [name]: { ...prev[name], ...patch } }));
  }, []);
  const enabledRetailers = useMemo(() => RETAILERS.filter((name) => merchants[name]?.enabled !== false), [merchants]);
  const value = useMemo(
    () => ({ merchants, updateMerchant, enabledRetailers, notifyEnabled, setNotifyEnabled, selectedMerchant, setSelectedMerchant, loaded }),
    [merchants, updateMerchant, enabledRetailers, notifyEnabled, selectedMerchant, loaded]
  );
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside a SettingsProvider');
  return ctx;
}

// =============================================================================
// SMALL COMPONENTS
// =============================================================================
function SectionHeader({ title, subtitle }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

function MerchantDropdown({ label, retailers, value, onChange }) {
  const [open, setOpen] = useState(false);
  const options = ['All', ...retailers];
  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
      {label ? <Text style={styles.miniLabel}>{label}</Text> : null}
      <Pressable onPress={() => setOpen(true)} style={[styles.input, styles.rowBetween, { marginTop: 4 }]}>
        <Text style={styles.bodyText}>{value && value !== 'All' ? value : 'All merchants'}</Text>
        <Ionicons name="chevron-down" size={16} color={COLORS.parchment} />
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setOpen(false)}>
          <View style={styles.dropdownList}>
            <ScrollView>
              {options.map((opt) => (
                <Pressable
                  key={opt}
                  onPress={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  style={styles.dropdownItem}
                >
                  <Text style={[styles.bodyText, opt === value && { color: COLORS.gold300, fontWeight: '700' }]}>{opt}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

// The card is a plain View - the tappable "open detail" region and the
// Watch button are separate sibling Pressables, never nested inside one
// another (nested Pressables in React Native don't reliably route touches
// to the right one).
function DealCard({ deal, watched, onAddToWatchlist, onOpenDetail }) {
  const pct = discountPercent(deal.originalPrice, deal.salePrice);
  return (
    <View style={styles.dealCard}>
      <Pressable onPress={() => onOpenDetail(deal)} style={styles.dealCardLink} accessibilityRole="link">
        <View style={styles.imageWrap}>
          <Image source={{ uri: deal.imageUrl }} style={styles.dealImage} resizeMode="cover" />
          {deal.isSample ? (
            <View style={styles.sampleBadge}>
              <Text style={styles.sampleBadgeText}>Sample</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.dealBody}>
          <View style={styles.rowBetween}>
            <Text style={styles.dealRetailer}>{deal.retailer}</Text>
            <View style={styles.dealTypeBadge}>
              <Text style={styles.dealTypeText}>{DEAL_TYPE_LABEL[deal.dealType] || 'Deal'}</Text>
            </View>
          </View>
          <Text style={[styles.dealBrand, styles.linkText]} numberOfLines={1}>{deal.brand}</Text>
          <Text style={styles.dealTitle} numberOfLines={2}>{deal.title}</Text>
          {deal.isOnline ? (
            <Text style={styles.storeLine} numberOfLines={1}>Ships to you - {deal.sku}</Text>
          ) : (
            <Text style={styles.storeLine} numberOfLines={2}>
              {deal.storeName} #{deal.storeNumber} - Aisle {deal.aisle} - {deal.sku}
            </Text>
          )}
          <View style={[styles.rowBetween, { marginTop: 4 }]}>
            <Text style={styles.discountText}>{pct}% off</Text>
            <Text style={styles.timeText}>{formatRelativeTime(deal.postedAt)}</Text>
          </View>
          <Text style={styles.detailLink}>View picture & full description</Text>
        </View>
      </Pressable>
      <View style={styles.dealCardActions}>
        <View style={styles.row}>
          <Text style={styles.priceOriginal}>{formatMoney(deal.originalPrice)}</Text>
          <Text style={styles.priceSale}>{formatMoney(deal.salePrice)}</Text>
        </View>
        <Pressable onPress={() => onAddToWatchlist(deal)} hitSlop={8} style={[styles.watchButton, watched && styles.watchButtonActive]}>
          <Ionicons name={watched ? 'checkmark-circle' : 'star'} size={12} color={COLORS.ocean950} />
          <Text style={styles.watchButtonText}>{watched ? 'Watching' : 'Watch'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function DealDetailModal({ deal, visible, watched, onClose, onAddToWatchlist }) {
  if (!deal) return null;
  const pct = discountPercent(deal.originalPrice, deal.salePrice);
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.detailSheet}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.imageWrap}>
              <Image source={{ uri: deal.imageUrl }} style={styles.detailImage} resizeMode="cover" />
              {deal.isSample ? (
                <View style={styles.sampleBadgeLarge}>
                  <Text style={styles.sampleBadgeText}>Sample photo - not the actual product</Text>
                </View>
              ) : null}
            </View>
            <View style={{ padding: 16 }}>
              <View style={styles.rowBetween}>
                <Text style={styles.dealRetailer}>{deal.retailer}</Text>
                <Pressable onPress={onClose} hitSlop={8}>
                  <Ionicons name="close-circle" size={26} color={COLORS.parchment} />
                </Pressable>
              </View>
              <Text style={[styles.sectionTitle, { fontSize: 22, marginTop: 8 }]}>{deal.brand}</Text>
              <Text style={[styles.bodyText, { marginTop: 4 }]}>{deal.title}</Text>
              <View style={[styles.row, { marginTop: 12 }]}>
                <Text style={styles.priceOriginal}>{formatMoney(deal.originalPrice)}</Text>
                <Text style={[styles.priceSale, { fontSize: 22 }]}>{formatMoney(deal.salePrice)}</Text>
                <Text style={[styles.discountText, { marginLeft: 12 }]}>{pct}% off</Text>
              </View>
              <Text style={[styles.mutedText, { marginTop: 16, lineHeight: 18 }]}>{buildDealDescription(deal)}</Text>
              {deal.isOnline && deal.url ? (
                <Pressable onPress={() => Linking.openURL(deal.url)} style={{ marginTop: 8 }}>
                  <Text style={styles.signupLink}>View on Amazon</Text>
                </Pressable>
              ) : deal.address ? (
                <Pressable onPress={() => Linking.openURL(`http://maps.apple.com/?daddr=${encodeURIComponent(deal.address)}`)} style={{ marginTop: 8 }}>
                  <Text style={styles.signupLink}>Get Directions</Text>
                </Pressable>
              ) : null}
              <Pressable onPress={() => onAddToWatchlist(deal)} style={[styles.goldButton, { marginTop: 20 }, watched && styles.watchButtonActive]}>
                <Text style={styles.primaryButtonText}>{watched ? 'Watching this item' : 'Add to Watchlist'}</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// =============================================================================
// SCREENS
// =============================================================================
function DashboardScreen() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [detailDeal, setDetailDeal] = useState(null);
  const { addItem, isWatched } = useWatchlist();
  const { merchants, enabledRetailers, selectedMerchant, setSelectedMerchant } = useSettings();

  const load = useCallback(async (selectedRetailer) => {
    const data = await getDeals({ retailer: selectedRetailer, merchantSettings: merchants });
    setDeals(data);
  }, [merchants]);

  useEffect(() => {
    setLoading(true);
    load(selectedMerchant).finally(() => setLoading(false));
  }, [selectedMerchant, load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load(selectedMerchant);
    setRefreshing(false);
  }, [selectedMerchant, load]);

  const handleAddToWatchlist = (deal) => {
    addItem({
      title: `${deal.brand} - ${deal.title}`,
      retailer: deal.retailer,
      targetPrice: deal.salePrice,
      storeName: deal.storeName,
      storeNumber: deal.storeNumber,
      storeAddress: deal.address,
    });
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <SectionHeader title="My Neighborhood Treasures" subtitle="Unadvertised drops, clearance & price errors nearby" />
      <MerchantDropdown label="Select Merchant" retailers={enabledRetailers} value={selectedMerchant} onChange={setSelectedMerchant} />
      {loading ? (
        <View style={styles.centerFill}>
          <ActivityIndicator color={COLORS.aqua400} />
        </View>
      ) : (
        <FlatList
          style={{ marginTop: 4 }}
          data={deals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DealCard
              deal={item}
              watched={isWatched(`${item.brand} - ${item.title}`)}
              onAddToWatchlist={handleAddToWatchlist}
              onOpenDetail={setDetailDeal}
            />
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.aqua400} />}
          ListEmptyComponent={<Text style={styles.emptyText}>No deals found. Check the Merchants tab to enable more retailers.</Text>}
        />
      )}
      <DealDetailModal
        deal={detailDeal}
        visible={!!detailDeal}
        watched={detailDeal ? isWatched(`${detailDeal.brand} - ${detailDeal.title}`) : false}
        onClose={() => setDetailDeal(null)}
        onAddToWatchlist={handleAddToWatchlist}
      />
    </SafeAreaView>
  );
}

const ZIP_ACCESSORY_ID = 'zipAccessory';

function LocatorScreen() {
  const { selectedMerchant, setSelectedMerchant, enabledRetailers } = useSettings();
  const mapRef = useRef(null);

  const [deviceLocation, setDeviceLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [focusedCenter, setFocusedCenter] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);

  const [zip, setZip] = useState('');
  const [zipLoading, setZipLoading] = useState(false);
  const [zipError, setZipError] = useState(null);
  const [upc, setUpc] = useState('');
  const [zipStock, setZipStock] = useState([]);

  const isOnlineOnlySelected = selectedMerchant === 'Amazon';

  useEffect(() => {
    (async () => {
      setLoadingLocation(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Location access was not granted. You can still see your stores below and use Get Directions on any of them.');
          return;
        }
        const pos = await Location.getCurrentPositionAsync({});
        const loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude, label: 'your current location' };
        setDeviceLocation(loc);
        setFocusedCenter(loc);
        setLocationError(null);
      } catch (e) {
        setLocationError('Could not get your location. Enter a ZIP code below to recenter the map, or just browse the pins.');
      } finally {
        setLoadingLocation(false);
      }
    })();
  }, []);

  // These are always your real, fixed stores - never a randomly-generated
  // "nearby" list - filtered to whichever merchant is selected right here
  // on the Locator tab, with a genuine straight-line distance from
  // wherever the map is currently centered. Amazon has no entry in
  // HOME_STORES, so it naturally returns nothing here.
  const storesToShow = useMemo(
    () => nearbyRealStores(focusedCenter?.latitude ?? 29.9766, focusedCenter?.longitude ?? -95.6358, selectedMerchant),
    [focusedCenter, selectedMerchant]
  );

  useEffect(() => {
    setSelectedStore(null);
    if (!mapRef.current || storesToShow.length === 0) return;
    const coordinates = storesToShow.map((s) => ({ latitude: s.latitude, longitude: s.longitude }));
    if (focusedCenter) coordinates.push({ latitude: focusedCenter.latitude, longitude: focusedCenter.longitude });
    mapRef.current.fitToCoordinates(coordinates, { edgePadding: { top: 60, right: 60, bottom: 60, left: 60 }, animated: true });
  }, [storesToShow, focusedCenter]);

  const canSearch = zip.trim().length === 5;

  const handleCheckZip = useCallback(async () => {
    if (zip.trim().length !== 5) return;
    Keyboard.dismiss();
    setZipError(null);
    setZipLoading(true);
    try {
      const geo = await geocodeZip(zip.trim());
      setFocusedCenter({ latitude: geo.latitude, longitude: geo.longitude, label: `${geo.city}, ${geo.state} ${geo.zip}` });
      if (upc.trim()) {
        const stock = await getLocalStock(zip.trim(), upc.trim(), selectedMerchant);
        setZipStock(stock);
      } else {
        setZipStock([]);
      }
    } catch (e) {
      setZipError(e.message || 'Something went wrong.');
      setZipStock([]);
    } finally {
      setZipLoading(false);
    }
  }, [zip, upc, selectedMerchant]);

  const handleUseMyLocation = () => {
    Keyboard.dismiss();
    setZip('');
    setUpc('');
    setZipStock([]);
    setZipError(null);
    if (deviceLocation) setFocusedCenter(deviceLocation);
  };

  const showUseMyLocation = deviceLocation && focusedCenter && focusedCenter.label !== deviceLocation.label;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <SectionHeader
        title="Store Locator"
        subtitle={`${selectedMerchant && selectedMerchant !== 'All' ? selectedMerchant : 'All merchants'} - your real, confirmed store location${selectedMerchant === 'All' ? 's' : ''}`}
      />
      <MerchantDropdown label="Select Merchant" retailers={enabledRetailers} value={selectedMerchant} onChange={setSelectedMerchant} />

      {isOnlineOnlySelected ? (
        <View style={{ paddingHorizontal: 24, paddingVertical: 32 }}>
          <Ionicons name="cloud-outline" size={32} color={COLORS.aqua400} style={{ alignSelf: 'center', marginBottom: 8 }} />
          <Text style={[styles.mutedText, { textAlign: 'center' }]}>
            Amazon is online-only - there's no physical store to show here. Amazon deals appear on the Dashboard with a link to the listing instead of a map pin.
          </Text>
        </View>
      ) : (
        <>
          {Platform.OS === 'web' ? (
            <Text style={[styles.mutedSmall, { textAlign: 'center', paddingHorizontal: 16, marginBottom: 8 }]}>
              Note: this map only renders correctly on your iPhone through Expo Go. Snack's own browser
              preview does not fully support this map library and may show something unrelated - please
              check this tab on your phone, not on the snack.expo.dev website.
            </Text>
          ) : null}

          {loadingLocation ? (
            <View style={styles.centerFill}>
              <ActivityIndicator color={COLORS.aqua400} />
            </View>
          ) : (
            <View style={styles.mapContainer}>
              <MapView
                ref={mapRef}
                provider={PROVIDER_DEFAULT}
                style={{ flex: 1 }}
                initialRegion={{ latitude: focusedCenter?.latitude ?? 29.9766, longitude: focusedCenter?.longitude ?? -95.6358, latitudeDelta: 0.3, longitudeDelta: 0.3 }}
                showsUserLocation
              >
                {storesToShow.map((s) => (
                  <Marker
                    key={s.id}
                    coordinate={{ latitude: s.latitude, longitude: s.longitude }}
                    calloutEnabled={false}
                    pinColor={COLORS.aqua500}
                    onPress={() => setSelectedStore(s)}
                  />
                ))}
              </MapView>
            </View>
          )}
          {locationError ? <Text style={[styles.errorText, { marginTop: 4 }]}>{locationError}</Text> : null}

          {selectedStore ? (
            <View style={styles.storeCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.storeName}>{selectedStore.storeName}</Text>
                <Text style={styles.storeDistance}>
                  Store #{selectedStore.storeNumber}{selectedStore.locationSource === 'approximate' ? ' (approx. location)' : ''}
                </Text>
                <Text style={styles.storeDistance}>{selectedStore.address}</Text>
                {selectedStore.distanceMiles != null ? (
                  <Text style={styles.storeDistance}>{selectedStore.distanceMiles.toFixed(1)} mi away</Text>
                ) : null}
                <Pressable onPress={() => Linking.openURL(`http://maps.apple.com/?daddr=${encodeURIComponent(selectedStore.address)}`)} style={{ marginTop: 4 }}>
                  <Text style={styles.signupLink}>Get Directions</Text>
                </Pressable>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.storeStock, { color: selectedStore.stockCount > 0 ? COLORS.aqua400 : COLORS.coral500 }]}>
                  {selectedStore.stockCount > 0 ? `~${selectedStore.stockCount} in stock` : 'Out of stock'}
                </Text>
                <Text style={styles.mutedSmall}>(simulated - no live inventory feed)</Text>
              </View>
            </View>
          ) : (
            <Text style={[styles.mutedSmall, { textAlign: 'center', marginTop: 8 }]}>Tap a pin on the map to see its details.</Text>
          )}
        </>
      )}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView style={{ marginTop: 12 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
          <Text style={styles.miniLabel}>ENTER A ZIP TO VIEW A DIFFERENT AREA OF THE MAP:</Text>
          <View style={[styles.row, { marginTop: 8, gap: 8 }]}>
            <TextInput
              value={zip}
              onChangeText={setZip}
              placeholder="ZIP code"
              placeholderTextColor="#E8DEC680"
              keyboardType="number-pad"
              maxLength={5}
              returnKeyType="search"
              onSubmitEditing={handleCheckZip}
              inputAccessoryViewID={Platform.OS === 'ios' ? ZIP_ACCESSORY_ID : undefined}
              style={[styles.input, { flex: 1 }]}
            />
            <Pressable onPress={handleCheckZip} disabled={!canSearch || zipLoading} style={[styles.primaryButton, { paddingHorizontal: 16 }, !canSearch && styles.buttonDisabled]}>
              {zipLoading ? <ActivityIndicator color={COLORS.ocean950} /> : <Text style={canSearch ? styles.primaryButtonText : styles.buttonDisabledText}>Go</Text>}
            </Pressable>
          </View>

          {!isOnlineOnlySelected ? (
            <>
              <Text style={[styles.miniLabel, { marginTop: 16 }]}>
                OPTIONAL: ALSO CHECK A UPC/SKU AT OTHER {selectedMerchant !== 'All' ? selectedMerchant.toUpperCase() : 'CHAIN'} LOCATIONS NEAR THAT ZIP
              </Text>
              <Text style={[styles.mutedSmall, { marginTop: 2 }]}>
                Booty is booty - if your confirmed store is sold out, the same item may be sitting at another location of the same chain.
              </Text>
              <TextInput
                value={upc}
                onChangeText={setUpc}
                placeholder="UPC or SKU from a deal card"
                placeholderTextColor="#E8DEC680"
                keyboardType="number-pad"
                returnKeyType="search"
                onSubmitEditing={handleCheckZip}
                inputAccessoryViewID={Platform.OS === 'ios' ? ZIP_ACCESSORY_ID : undefined}
                style={[styles.input, { marginTop: 8 }]}
              />
              {selectedMerchant === 'All' ? (
                <Text style={[styles.mutedSmall, { marginTop: 6 }]}>Pick a specific merchant above to check other locations.</Text>
              ) : null}

              {zipStock.length > 0 ? (
                <View style={{ marginTop: 12 }}>
                  <Text style={styles.miniLabel}>OTHER {String(selectedMerchant).toUpperCase()} LOCATIONS NEAR {zip} (SIMULATED - NO LIVE INVENTORY FEED):</Text>
                  {zipStock.map((s) => (
                    <View key={s.id} style={[styles.storeCard, { marginHorizontal: 0, marginTop: 8 }]}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.storeName}>{s.storeName} #{s.storeNumber}</Text>
                        <Text style={styles.storeDistance}>{s.distanceMiles.toFixed(1)} mi away - {formatMoney(s.price)}</Text>
                      </View>
                      <Text style={[styles.storeStock, { color: s.stockCount > 0 ? COLORS.aqua400 : COLORS.coral500 }]}>
                        {s.stockCount > 0 ? `~${s.stockCount} in stock` : 'Out of stock'}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </>
          ) : null}

          {showUseMyLocation ? (
            <Pressable onPress={handleUseMyLocation} style={[styles.secondaryButton, { marginTop: 8 }]}>
              <Text style={styles.bodyText}>Use My Current Location Instead</Text>
            </Pressable>
          ) : null}
          {zipError ? <Text style={styles.errorText}>{zipError}</Text> : null}
        </ScrollView>
      </KeyboardAvoidingView>

      {Platform.OS === 'ios' ? (
        <InputAccessoryView nativeID={ZIP_ACCESSORY_ID}>
          <View style={styles.keyboardAccessory}>
            <Pressable onPress={() => Keyboard.dismiss()} style={styles.accessoryButton} hitSlop={8}>
              <Text style={styles.accessoryButtonText}>Done</Text>
            </Pressable>
            <Pressable onPress={handleCheckZip} disabled={!canSearch} style={styles.accessoryButton} hitSlop={8}>
              <Text style={[styles.accessoryButtonText, { color: canSearch ? COLORS.aqua400 : 'rgba(232,222,198,0.3)' }]}>Go</Text>
            </Pressable>
          </View>
        </InputAccessoryView>
      ) : null}
    </SafeAreaView>
  );
}

const SCAN_TYPES = ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128'];
function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [manualUpc, setManualUpc] = useState('');
  const lastScanRef = useRef(null);
  const { addItem, isWatched } = useWatchlist();

  const runLookup = useCallback(async (upc) => {
    setLoading(true);
    setScanning(false);
    try {
      const data = await lookupUpc(upc);
      setResult(data);
    } finally {
      setLoading(false);
    }
  }, []);
  const handleBarcodeScanned = useCallback(({ data }) => {
    if (!scanning || lastScanRef.current === data) return;
    lastScanRef.current = data;
    runLookup(data);
  }, [scanning, runLookup]);
  const handleRescan = () => {
    lastScanRef.current = null;
    setResult(null);
    setScanning(true);
  };
  const resultTitle = result ? `${result.brand} - ${result.title}` : null;
  const handleAddToWatchlist = () => {
    if (!result) return;
    addItem({
      title: resultTitle,
      retailer: result.retailer || 'All',
      targetPrice: result.lowestRecordedPrice || result.salePrice || 0,
      storeName: result.storeName,
      storeNumber: result.storeNumber,
      storeAddress: result.address,
    });
  };

  if (!permission) {
    return <SafeAreaView style={[styles.screen, styles.centerFill]}><ActivityIndicator color={COLORS.aqua400} /></SafeAreaView>;
  }
  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.screen, styles.centerFill, { paddingHorizontal: 24 }]}>
        <Ionicons name="camera-outline" size={40} color={COLORS.aqua400} />
        <Text style={[styles.bodyText, { textAlign: 'center', marginTop: 12 }]}>Camera access is needed to scan barcodes in-store.</Text>
        <Pressable onPress={requestPermission} style={[styles.primaryButton, { marginTop: 16, paddingHorizontal: 20 }]}>
          <Text style={styles.primaryButtonText}>Grant Camera Access</Text>
        </Pressable>
        <Text style={[styles.mutedText, { textAlign: 'center', marginTop: 32 }]}>Or enter a barcode manually:</Text>
        <View style={[styles.row, { marginTop: 8, width: '100%', gap: 8 }]}>
          <TextInput value={manualUpc} onChangeText={setManualUpc} placeholder="UPC number" placeholderTextColor="#E8DEC680" keyboardType="number-pad" style={[styles.input, { flex: 1 }]} />
          <Pressable onPress={() => manualUpc.trim() && runLookup(manualUpc.trim())} style={[styles.goldButton, { justifyContent: 'center' }]}>
            <Text style={styles.primaryButtonText}>Look Up</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <SectionHeader title="Barcode Scanner" subtitle="Scan a UPC to check for known price drops" />
      <View style={styles.cameraContainer}>
        {scanning ? (
          <CameraView style={{ flex: 1 }} facing="back" barcodeScannerSettings={{ barcodeTypes: SCAN_TYPES }} onBarcodeScanned={handleBarcodeScanned} />
        ) : (
          <View style={[styles.centerFill, { backgroundColor: COLORS.ocean900 }]}>
            {loading ? <ActivityIndicator color={COLORS.aqua400} /> : <Ionicons name="checkmark-circle" size={48} color={COLORS.aqua400} />}
          </View>
        )}
      </View>
      {result ? (
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>{result.source === 'known_deal' ? 'Known Price Drop!' : 'Scan Result'}</Text>
          <Text style={[styles.dealBrand, { marginTop: 4 }]}>{result.brand}</Text>
          <Text style={styles.bodyText}>{result.title}</Text>
          {result.storeName ? (
            <Text style={styles.storeLine}>{result.storeName} #{result.storeNumber}{result.aisle ? ` - Aisle ${result.aisle} - ${result.sku}` : ''}</Text>
          ) : (
            <Text style={styles.mutedSmall}>No specific retailer matched - store location unknown for this scan.</Text>
          )}
          {result.salePrice ? (
            <View style={[styles.row, { marginTop: 8 }]}>
              <Text style={styles.priceOriginal}>{formatMoney(result.originalPrice)}</Text>
              <Text style={styles.priceSale}>{formatMoney(result.salePrice)}</Text>
            </View>
          ) : result.lowestRecordedPrice ? (
            <Text style={[styles.mutedText, { marginTop: 8 }]}>Lowest recorded price: {formatMoney(result.lowestRecordedPrice)}</Text>
          ) : (
            <Text style={[styles.mutedText, { marginTop: 8 }]}>No pricing history available.</Text>
          )}
          <View style={[styles.row, { marginTop: 16, gap: 8 }]}>
            <Pressable onPress={handleAddToWatchlist} style={[styles.goldButton, { flex: 1 }, resultTitle && isWatched(resultTitle) && styles.watchButtonActive]}>
              <Text style={styles.primaryButtonText}>{resultTitle && isWatched(resultTitle) ? 'Watching' : 'Add to Watchlist'}</Text>
            </Pressable>
            <Pressable onPress={handleRescan} style={[styles.secondaryButton, { flex: 1 }]}>
              <Text style={styles.bodyText}>Rescan</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Text style={[styles.mutedText, { textAlign: 'center', marginTop: 16 }]}>Point the camera at a barcode to scan</Text>
      )}
    </SafeAreaView>
  );
}

function WatchItemCard({ item, onRemove }) {
  const hit = item.currentPrice <= item.targetPrice;
  return (
    <View style={[styles.watchCard, hit && styles.watchCardHit]}>
      <View style={styles.rowBetween}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={styles.dealRetailer}>{item.retailer}</Text>
          <Text style={[styles.dealBrand, { marginTop: 2 }]}>{item.title}</Text>
          {item.storeName ? <Text style={styles.storeLine}>{item.storeName} #{item.storeNumber}</Text> : null}
          {item.storeAddress ? <Text style={styles.storeLine}>{item.storeAddress}</Text> : null}
        </View>
        <Pressable onPress={() => onRemove(item.id)} hitSlop={8}>
          <Ionicons name="trash-outline" size={18} color={COLORS.coral500} />
        </Pressable>
      </View>
      <View style={[styles.rowBetween, { marginTop: 12 }]}>
        <View>
          <Text style={styles.miniLabel}>Target</Text>
          <Text style={styles.dealBrand}>{formatMoney(item.targetPrice)}</Text>
        </View>
        <View>
          <Text style={styles.miniLabel}>Current (simulated)</Text>
          <Text style={[styles.dealBrand, hit && { color: COLORS.gold300 }]}>{formatMoney(item.currentPrice)}</Text>
        </View>
        {hit ? (
          <View style={styles.alertBadge}>
            <MaterialCommunityIcons name="treasure-chest" size={14} color={COLORS.ocean950} />
            <Text style={styles.alertBadgeText}>Price Alert!</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function WatchlistScreen() {
  const { items, addItem, removeItem, refreshPrices } = useWatchlist();
  const { enabledRetailers } = useSettings();
  const [title, setTitle] = useState('');
  const [retailer, setRetailer] = useState('All');
  const [targetPrice, setTargetPrice] = useState('');
  const canAdd = title.trim().length > 0 && targetPrice.trim().length > 0 && !Number.isNaN(Number(targetPrice));

  const handleAdd = () => {
    if (!canAdd) return;
    const store = deriveStoreDetails(title.trim(), retailer);
    addItem({ title: title.trim(), retailer, targetPrice: Number(targetPrice), storeName: store.storeName, storeNumber: store.storeNumber, storeAddress: store.address });
    setTitle('');
    setTargetPrice('');
  };
  const alertCount = items.filter((i) => i.currentPrice <= i.targetPrice).length;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <SectionHeader title="Watchlist" subtitle={alertCount > 0 ? `${alertCount} item(s) hit your target price` : 'Track items & get alerted at your price'} />
      <View style={{ paddingHorizontal: 16 }}>
        <TextInput value={title} onChangeText={setTitle} placeholder="Item name or search query" placeholderTextColor="#E8DEC680" style={styles.input} />
        <View style={[styles.row, { marginTop: 8, gap: 8 }]}>
          <TextInput value={targetPrice} onChangeText={setTargetPrice} placeholder="Target price" placeholderTextColor="#E8DEC680" keyboardType="decimal-pad" style={[styles.input, { flex: 1 }]} />
          <Pressable onPress={handleAdd} disabled={!canAdd} style={[styles.primaryButton, { paddingHorizontal: 16 }, !canAdd && styles.buttonDisabled]}>
            <Text style={canAdd ? styles.primaryButtonText : styles.buttonDisabledText}>Add</Text>
          </Pressable>
        </View>
      </View>
      <MerchantDropdown label="Select Merchant" retailers={enabledRetailers} value={retailer} onChange={setRetailer} />
      <Pressable onPress={refreshPrices} style={styles.secondaryButtonFull}>
        <Text style={styles.mutedSmall}>Simulate Price Check</Text>
      </Pressable>
      <FlatList
        style={{ marginTop: 12 }}
        data={items.filter((i) => retailer === 'All' || i.retailer === retailer)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <WatchItemCard item={item} onRemove={removeItem} />}
        contentContainerStyle={{ paddingBottom: 24, paddingTop: 8 }}
        ListEmptyComponent={<Text style={styles.emptyText}>Nothing on your watchlist yet - add an item above or tap "Watch" on a deal.</Text>}
      />
    </SafeAreaView>
  );
}

const PLAN_LABEL = { mock: 'Mock (built-in)', paid: 'Apify Actor' };
function PlanPicker({ plans, active, onChange }) {
  return (
    <View style={[styles.row, { gap: 8, marginTop: 8 }]}>
      {plans.map((plan) => {
        const isActive = active === plan;
        return (
          <Pressable key={plan} onPress={() => onChange(plan)} style={[styles.planChip, isActive ? styles.filterChipActive : styles.filterChipInactive]}>
            <Text style={isActive ? styles.planChipTextActive : styles.planChipTextInactive}>{PLAN_LABEL[plan]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
function MerchantCard({ name }) {
  const { merchants, updateMerchant } = useSettings();
  const cfg = merchants[name] || { enabled: true, plan: 'mock', apiKey: '', apiSecret: '', apiBaseUrl: '' };
  const info = getMerchantInfo(name);
  const home = HOME_STORES[name];
  const planDetail = cfg.plan === 'paid' ? info.paid : null;

  return (
    <View style={styles.merchantCard}>
      <View style={styles.rowBetween}>
        <Text style={styles.dealBrand}>{name}</Text>
        <Switch value={cfg.enabled} onValueChange={(v) => updateMerchant(name, { enabled: v })} trackColor={{ false: COLORS.ocean700, true: COLORS.aqua500 }} thumbColor={COLORS.parchment} />
      </View>
      {home ? (
        <Text style={[styles.mutedSmall, { marginTop: 4 }]}>
          Your store: #{home.storeNumber} - {home.address}{home.locationSource === 'approximate' ? ' (approximate)' : ''}
        </Text>
      ) : name === 'Amazon' ? (
        <Text style={[styles.mutedSmall, { marginTop: 4 }]}>Online-only - no physical store or map pin.</Text>
      ) : null}
      <PlanPicker plans={info.availablePlans} active={cfg.plan} onChange={(plan) => updateMerchant(name, { plan })} />
      {cfg.plan !== 'paid' && info.paid?.notes ? <Text style={[styles.mutedSmall, { marginTop: 8 }]}>{info.paid.notes}</Text> : null}
      {cfg.plan === 'paid' && planDetail ? (
        <View style={styles.planDetailBox}>
          <View style={styles.rowBetween}>
            <Text style={styles.planDetailLabel}>{planDetail.label}</Text>
            {planDetail.signupUrl ? (
              <Pressable onPress={() => Linking.openURL(planDetail.signupUrl)}>
                <Text style={styles.signupLink}>Browse Actors</Text>
              </Pressable>
            ) : null}
          </View>
          {planDetail.notes ? <Text style={[styles.mutedSmall, { marginTop: 4 }]}>{planDetail.notes}</Text> : null}
          {(planDetail.fields || []).map((f) => (
            <TextInput
              key={f.key}
              value={cfg[f.key] || ''}
              onChangeText={(v) => updateMerchant(name, { [f.key]: v })}
              placeholder={f.label}
              placeholderTextColor="#E8DEC680"
              autoCapitalize="none"
              secureTextEntry={f.key === 'apiKey'}
              style={[styles.input, { marginTop: 8, fontSize: 12, paddingVertical: 8 }]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
function MerchantsScreen() {
  const { notifyEnabled, setNotifyEnabled } = useSettings();
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <SectionHeader title="Merchants" subtitle="Toggle retailers and connect real data where it exists" />
      <View style={[styles.merchantCard, styles.rowBetween]}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.dealBrand}>Price-alert notifications</Text>
          <Text style={[styles.mutedSmall, { marginTop: 4 }]}>Local notifications only - fires while the app is open/reopened.</Text>
        </View>
        <Switch value={notifyEnabled} onValueChange={setNotifyEnabled} trackColor={{ false: COLORS.ocean700, true: COLORS.aqua500 }} thumbColor={COLORS.parchment} />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {RETAILERS.map((name) => <MerchantCard key={name} name={name} />)}
      </ScrollView>
    </SafeAreaView>
  );
}

// =============================================================================
// NAVIGATION ROOT
// =============================================================================
=======
>>>>>>> 5684b90b15059263a1890744bb55229814568d7f
const Tab = createBottomTabNavigator();

const OceanTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.aqua400,
    background: colors.ocean950,
    card: colors.ocean900,
    text: colors.parchment,
    border: colors.ocean700,
    notification: colors.gold400,
  },
};

function TabIcon({ route, color, size }) {
  switch (route.name) {
    case 'Dashboard':
      return <Ionicons name="compass" size={size} color={color} />;
    case 'Locator':
      return <Ionicons name="map" size={size} color={color} />;
    case 'Scanner':
      return <Ionicons name="barcode-outline" size={size} color={color} />;
    case 'Watchlist':
      return <MaterialCommunityIcons name="treasure-chest" size={size} color={color} />;
    case 'Merchants':
      return <Ionicons name="storefront-outline" size={size} color={color} />;
    default:
      return null;
  }
}

export default function App() {
  const [fontsLoaded] = useFonts({ PirataOne_400Regular });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.ocean950, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.aqua400} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <WatchlistProvider>
          <NavigationContainer theme={OceanTheme}>
            <StatusBar style="light" />
            <Tab.Navigator
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => <TabIcon route={route} color={color} size={size} />,
                tabBarActiveTintColor: colors.gold400,
                tabBarInactiveTintColor: colors.aqua700,
                tabBarStyle: {
                  backgroundColor: colors.ocean900,
                  borderTopColor: colors.ocean700,
                },
              })}
            >
              <Tab.Screen name="Dashboard" component={DashboardScreen} />
              <Tab.Screen name="Locator" component={LocatorScreen} />
              <Tab.Screen name="Scanner" component={ScannerScreen} />
              <Tab.Screen name="Watchlist" component={WatchlistScreen} />
              <Tab.Screen name="Merchants" component={MerchantsScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </WatchlistProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
<<<<<<< HEAD

// =============================================================================
// STYLES
// =============================================================================
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.ocean950 },
  centerFill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionHeader: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  sectionTitle: { fontFamily: 'PirataOne_400Regular', color: COLORS.parchment, fontSize: 30 },
  sectionSubtitle: { color: 'rgba(77,216,224,0.8)', fontSize: 12, marginTop: 4 },
  filterChipActive: { backgroundColor: COLORS.aqua500, borderColor: COLORS.aqua300 },
  filterChipInactive: { backgroundColor: COLORS.ocean800, borderColor: COLORS.ocean600 },
  planChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  planChipTextActive: { color: COLORS.ocean950, fontSize: 12, fontWeight: '600' },
  planChipTextInactive: { color: 'rgba(232,222,198,0.7)', fontSize: 12 },
  emptyText: { color: 'rgba(232,222,198,0.5)', textAlign: 'center', marginTop: 40 },
  input: { backgroundColor: COLORS.ocean850, borderWidth: 1, borderColor: COLORS.ocean700, color: COLORS.parchment, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  primaryButton: { backgroundColor: COLORS.aqua500, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  primaryButtonText: { color: COLORS.ocean950, fontWeight: '600' },
  goldButton: { backgroundColor: COLORS.gold400, borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  secondaryButton: { backgroundColor: COLORS.ocean800, borderWidth: 1, borderColor: COLORS.ocean600, borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  secondaryButtonFull: { marginHorizontal: 16, marginTop: 4, backgroundColor: COLORS.ocean800, borderWidth: 1, borderColor: COLORS.ocean600, borderRadius: 12, paddingVertical: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: COLORS.ocean800 },
  buttonDisabledText: { color: 'rgba(232,222,198,0.4)' },
  watchButtonActive: { backgroundColor: COLORS.aqua500 },
  errorText: { color: COLORS.coral500, textAlign: 'center', marginTop: 8, paddingHorizontal: 16 },
  bodyText: { color: COLORS.parchment },
  mutedText: { color: 'rgba(232,222,198,0.5)', fontSize: 12 },
  mutedSmall: { color: 'rgba(232,222,198,0.5)', fontSize: 11 },
  mapContainer: { marginHorizontal: 16, marginTop: 8, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.ocean700, height: 260 },
  storeCard: { marginHorizontal: 16, backgroundColor: COLORS.ocean850, borderWidth: 1, borderColor: COLORS.ocean700, borderRadius: 12, padding: 12, marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  storeName: { color: COLORS.parchment, fontWeight: '600' },
  storeDistance: { color: 'rgba(232,222,198,0.5)', fontSize: 12, marginTop: 2 },
  storeStock: { fontSize: 12, marginTop: 2 },
  storeLine: { color: COLORS.aqua300, fontSize: 11, marginTop: 4 },
  cameraContainer: { marginHorizontal: 16, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.ocean700, height: 320 },
  resultCard: { marginHorizontal: 16, marginTop: 16, backgroundColor: COLORS.ocean850, borderWidth: 1, borderColor: COLORS.ocean700, borderRadius: 16, padding: 16 },
  resultLabel: { color: COLORS.aqua400, fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  dealCard: { backgroundColor: COLORS.ocean850, borderWidth: 1, borderColor: COLORS.ocean700, borderRadius: 16, marginBottom: 12, marginHorizontal: 16, overflow: 'hidden' },
  dealCardLink: { flexDirection: 'row', padding: 12 },
  dealCardActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingBottom: 12, paddingTop: 2 },
  linkText: { textDecorationLine: 'underline', color: COLORS.aqua300 },
  imageWrap: { position: 'relative' },
  dealImage: { width: 80, height: 80, borderRadius: 12, backgroundColor: COLORS.ocean800 },
  sampleBadge: { position: 'absolute', bottom: 2, left: 2, right: 2, backgroundColor: 'rgba(2,19,27,0.75)', borderRadius: 6, paddingVertical: 1 },
  sampleBadgeText: { color: COLORS.gold300, fontSize: 8, fontWeight: '700', textAlign: 'center', textTransform: 'uppercase' },
  sampleBadgeLarge: { position: 'absolute', bottom: 8, left: 8, right: 8, backgroundColor: 'rgba(2,19,27,0.75)', borderRadius: 8, paddingVertical: 6 },
  dealBody: { flex: 1, marginLeft: 12 },
  dealRetailer: { color: COLORS.aqua400, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  dealTypeBadge: { backgroundColor: COLORS.ocean800, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  dealTypeText: { color: 'rgba(232,222,198,0.7)', fontSize: 10 },
  dealBrand: { color: COLORS.parchment, fontWeight: '600', marginTop: 4 },
  dealTitle: { color: 'rgba(232,222,198,0.7)', fontSize: 12 },
  priceOriginal: { color: 'rgba(232,222,198,0.4)', fontSize: 12, textDecorationLine: 'line-through', marginRight: 8 },
  priceSale: { color: COLORS.gold300, fontSize: 16, fontWeight: '700' },
  watchButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(232,185,36,0.9)', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  watchButtonText: { color: COLORS.ocean950, fontSize: 11, fontWeight: '600', marginLeft: 4 },
  discountText: { color: COLORS.coral500, fontSize: 12, fontWeight: '700' },
  timeText: { color: 'rgba(232,222,198,0.4)', fontSize: 11 },
  detailLink: { color: COLORS.aqua400, fontSize: 11, marginTop: 6, textDecorationLine: 'underline' },
  watchCard: { marginHorizontal: 16, marginBottom: 12, borderRadius: 16, padding: 16, borderWidth: 1, backgroundColor: COLORS.ocean850, borderColor: COLORS.ocean700 },
  watchCardHit: { backgroundColor: 'rgba(232,185,36,0.1)', borderColor: COLORS.gold400 },
  miniLabel: { color: 'rgba(232,222,198,0.5)', fontSize: 11 },
  alertBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.gold400, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  alertBadgeText: { color: COLORS.ocean950, fontSize: 12, fontWeight: '700', marginLeft: 4 },
  merchantCard: { marginHorizontal: 16, marginBottom: 12, backgroundColor: COLORS.ocean850, borderWidth: 1, borderColor: COLORS.ocean700, borderRadius: 16, padding: 16 },
  planDetailBox: { marginTop: 12, backgroundColor: COLORS.ocean900, borderRadius: 12, padding: 12 },
  planDetailLabel: { color: COLORS.aqua400, fontSize: 12, fontWeight: '600' },
  signupLink: { color: COLORS.gold300, fontSize: 12, textDecorationLine: 'underline' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(2,19,27,0.7)', justifyContent: 'flex-end' },
  dropdownList: { backgroundColor: COLORS.ocean900, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '60%', paddingVertical: 8, marginTop: 'auto' },
  dropdownItem: { paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.ocean800 },
  detailSheet: { backgroundColor: COLORS.ocean950, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '88%', marginTop: 'auto' },
  detailImage: { width: '100%', height: 260, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  keyboardAccessory: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.ocean900, borderTopWidth: 1, borderTopColor: COLORS.ocean700, paddingHorizontal: 16, paddingVertical: 10 },
  accessoryButton: { paddingHorizontal: 12, paddingVertical: 6 },
  accessoryButtonText: { color: COLORS.parchment, fontWeight: '600', fontSize: 15 },
});
=======
>>>>>>> 5684b90b15059263a1890744bb55229814568d7f
