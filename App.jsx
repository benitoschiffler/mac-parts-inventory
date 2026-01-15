import React, { useState, useEffect, useCallback } from 'react';

// ============================================
// CONFIGURATION - UPDATE THIS WITH YOUR GOOGLE APPS SCRIPT URL
// ============================================
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
// ============================================

// QR Code generation
const generateQRCode = (data, size = 200) => {
  const encoded = encodeURIComponent(typeof data === 'string' ? data : JSON.stringify(data));
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}`;
};

// Comprehensive Mac model database
const MAC_MODELS = {
  macbook_pro: {
    name: 'MacBook Pro',
    variants: [
      { year: '2024', size: '14"', chip: 'M4/M4 Pro/M4 Max' },
      { year: '2024', size: '16"', chip: 'M4 Pro/M4 Max' },
      { year: '2023', size: '14"', chip: 'M3/M3 Pro/M3 Max' },
      { year: '2023', size: '16"', chip: 'M3 Pro/M3 Max' },
      { year: '2022', size: '13"', chip: 'M2' },
      { year: '2021', size: '14"', chip: 'M1 Pro/M1 Max' },
      { year: '2021', size: '16"', chip: 'M1 Pro/M1 Max' },
      { year: '2020', size: '13"', chip: 'M1' },
      { year: '2020', size: '13"', chip: 'Intel i5/i7' },
      { year: '2019', size: '16"', chip: 'Intel i7/i9' },
      { year: '2019', size: '13"', chip: 'Intel i5/i7' },
      { year: '2019', size: '15"', chip: 'Intel i7/i9' },
      { year: '2018', size: '13"', chip: 'Intel i5/i7' },
      { year: '2018', size: '15"', chip: 'Intel i7/i9' },
      { year: '2017', size: '13"', chip: 'Intel i5/i7' },
      { year: '2017', size: '15"', chip: 'Intel i7' },
      { year: '2016', size: '13"', chip: 'Intel i5/i7' },
      { year: '2016', size: '15"', chip: 'Intel i7' },
      { year: '2015', size: '13"', chip: 'Intel i5/i7', modelNum: 'A1502' },
      { year: '2015', size: '15"', chip: 'Intel i7', modelNum: 'A1398' },
      { year: '2014', size: '13"', chip: 'Intel i5/i7', modelNum: 'A1502' },
      { year: '2014', size: '15"', chip: 'Intel i7', modelNum: 'A1398' },
      { year: '2013', size: '13"', chip: 'Intel i5/i7', modelNum: 'A1502' },
      { year: '2013', size: '15"', chip: 'Intel i7', modelNum: 'A1398' },
      { year: '2012', size: '13"', chip: 'Intel i5/i7 (Retina)', modelNum: 'A1425' },
      { year: '2012', size: '13"', chip: 'Intel i5/i7 (Non-Retina)', modelNum: 'A1278' },
      { year: '2012', size: '15"', chip: 'Intel i7 (Retina)', modelNum: 'A1398' },
      { year: '2012', size: '15"', chip: 'Intel i7 (Non-Retina)', modelNum: 'A1286' },
      { year: '2011', size: '13"', chip: 'Intel i5/i7', modelNum: 'A1278' },
      { year: '2011', size: '15"', chip: 'Intel i7', modelNum: 'A1286' },
      { year: '2011', size: '17"', chip: 'Intel i7', modelNum: 'A1297' },
      { year: '2010', size: '13"', chip: 'Intel Core 2 Duo', modelNum: 'A1278' },
      { year: '2010', size: '15"', chip: 'Intel i5/i7', modelNum: 'A1286' },
      { year: '2010', size: '17"', chip: 'Intel i5/i7', modelNum: 'A1297' },
      { year: '2009', size: '13"', chip: 'Intel Core 2 Duo', modelNum: 'A1278' },
      { year: '2009', size: '15"', chip: 'Intel Core 2 Duo', modelNum: 'A1286' },
      { year: '2009', size: '17"', chip: 'Intel Core 2 Duo', modelNum: 'A1297' },
      { year: '2008', size: '15"', chip: 'Intel Core 2 Duo', modelNum: 'A1260/A1286' },
      { year: '2008', size: '17"', chip: 'Intel Core 2 Duo', modelNum: 'A1261' },
      { year: '2007', size: '15"', chip: 'Intel Core 2 Duo', modelNum: 'A1226' },
      { year: '2007', size: '17"', chip: 'Intel Core 2 Duo', modelNum: 'A1229' },
      { year: '2006', size: '15"', chip: 'Intel Core Duo/Core 2 Duo', modelNum: 'A1150/A1211' },
      { year: '2006', size: '17"', chip: 'Intel Core Duo', modelNum: 'A1151' },
    ],
  },
  macbook_air: {
    name: 'MacBook Air',
    variants: [
      { year: '2024', size: '13"', chip: 'M3' },
      { year: '2024', size: '15"', chip: 'M3' },
      { year: '2023', size: '15"', chip: 'M2' },
      { year: '2022', size: '13"', chip: 'M2' },
      { year: '2020', size: '13"', chip: 'M1' },
      { year: '2020', size: '13"', chip: 'Intel i3/i5/i7' },
      { year: '2019', size: '13"', chip: 'Intel i5' },
      { year: '2018', size: '13"', chip: 'Intel i5 (Retina)' },
      { year: '2017', size: '13"', chip: 'Intel i5/i7', modelNum: 'A1466' },
      { year: '2015', size: '11"', chip: 'Intel i5/i7', modelNum: 'A1465' },
      { year: '2015', size: '13"', chip: 'Intel i5/i7', modelNum: 'A1466' },
      { year: '2014', size: '11"', chip: 'Intel i5/i7', modelNum: 'A1465' },
      { year: '2014', size: '13"', chip: 'Intel i5/i7', modelNum: 'A1466' },
      { year: '2013', size: '11"', chip: 'Intel i5/i7', modelNum: 'A1465' },
      { year: '2013', size: '13"', chip: 'Intel i5/i7', modelNum: 'A1466' },
      { year: '2012', size: '11"', chip: 'Intel i5/i7', modelNum: 'A1465' },
      { year: '2012', size: '13"', chip: 'Intel i5/i7', modelNum: 'A1466' },
      { year: '2011', size: '11"', chip: 'Intel i5/i7', modelNum: 'A1370' },
      { year: '2011', size: '13"', chip: 'Intel i5/i7', modelNum: 'A1369' },
      { year: '2010', size: '11"', chip: 'Intel Core 2 Duo', modelNum: 'A1370' },
      { year: '2010', size: '13"', chip: 'Intel Core 2 Duo', modelNum: 'A1369' },
      { year: '2009', size: '13"', chip: 'Intel Core 2 Duo', modelNum: 'A1304' },
      { year: '2008', size: '13"', chip: 'Intel Core 2 Duo', modelNum: 'A1237' },
    ],
  },
  macbook: {
    name: 'MacBook',
    variants: [
      { year: '2017', size: '12"', chip: 'Intel m3/i5/i7', modelNum: 'A1534' },
      { year: '2016', size: '12"', chip: 'Intel m3/m5/m7', modelNum: 'A1534' },
      { year: '2015', size: '12"', chip: 'Intel Core M', modelNum: 'A1534' },
      { year: '2010', size: '13"', chip: 'Intel Core 2 Duo (White)', modelNum: 'A1342' },
      { year: '2009', size: '13"', chip: 'Intel Core 2 Duo (White)', modelNum: 'A1342/A1181' },
      { year: '2008', size: '13"', chip: 'Intel Core 2 Duo (Aluminum)', modelNum: 'A1278' },
      { year: '2008', size: '13"', chip: 'Intel Core 2 Duo (White/Black)', modelNum: 'A1181' },
      { year: '2007', size: '13"', chip: 'Intel Core 2 Duo', modelNum: 'A1181' },
      { year: '2006', size: '13"', chip: 'Intel Core Duo/Core 2 Duo', modelNum: 'A1181' },
    ],
  },
  imac: {
    name: 'iMac',
    variants: [
      { year: '2024', size: '24"', chip: 'M4' },
      { year: '2023', size: '24"', chip: 'M3' },
      { year: '2021', size: '24"', chip: 'M1' },
      { year: '2020', size: '27"', chip: 'Intel i5/i7/i9 (5K)' },
      { year: '2019', size: '21.5"', chip: 'Intel i3/i5/i7 (4K)' },
      { year: '2019', size: '27"', chip: 'Intel i5/i7/i9 (5K)' },
      { year: '2017', size: '21.5"', chip: 'Intel i5/i7', modelNum: 'A1418' },
      { year: '2017', size: '27"', chip: 'Intel i5/i7 (5K)', modelNum: 'A1419' },
      { year: '2015', size: '21.5"', chip: 'Intel i5/i7', modelNum: 'A1418' },
      { year: '2015', size: '27"', chip: 'Intel i5/i7 (5K)', modelNum: 'A1419' },
      { year: '2014', size: '21.5"', chip: 'Intel i5', modelNum: 'A1418' },
      { year: '2014', size: '27"', chip: 'Intel i5/i7 (5K)', modelNum: 'A1419' },
      { year: '2013', size: '21.5"', chip: 'Intel i5/i7', modelNum: 'A1418' },
      { year: '2013', size: '27"', chip: 'Intel i5/i7', modelNum: 'A1419' },
      { year: '2012', size: '21.5"', chip: 'Intel i5/i7', modelNum: 'A1418' },
      { year: '2012', size: '27"', chip: 'Intel i5/i7', modelNum: 'A1419' },
      { year: '2011', size: '21.5"', chip: 'Intel i5/i7', modelNum: 'A1311' },
      { year: '2011', size: '27"', chip: 'Intel i5/i7', modelNum: 'A1312' },
      { year: '2010', size: '21.5"', chip: 'Intel i3/i5/i7', modelNum: 'A1311' },
      { year: '2010', size: '27"', chip: 'Intel i3/i5/i7', modelNum: 'A1312' },
      { year: '2009', size: '21.5"', chip: 'Intel Core 2 Duo', modelNum: 'A1311' },
      { year: '2009', size: '27"', chip: 'Intel Core 2 Duo/i5/i7', modelNum: 'A1312' },
      { year: '2008', size: '20"', chip: 'Intel Core 2 Duo', modelNum: 'A1224' },
      { year: '2008', size: '24"', chip: 'Intel Core 2 Duo', modelNum: 'A1225' },
      { year: '2007', size: '20"', chip: 'Intel Core 2 Duo (Aluminum)', modelNum: 'A1224' },
      { year: '2007', size: '24"', chip: 'Intel Core 2 Duo (Aluminum)', modelNum: 'A1225' },
      { year: '2006', size: '17"', chip: 'Intel Core Duo/Core 2 Duo', modelNum: 'A1173/A1195' },
      { year: '2006', size: '20"', chip: 'Intel Core Duo/Core 2 Duo', modelNum: 'A1174/A1207' },
      { year: '2006', size: '24"', chip: 'Intel Core 2 Duo', modelNum: 'A1200' },
      { year: '2005', size: '17"', chip: 'G5', modelNum: 'A1058/A1144' },
      { year: '2005', size: '20"', chip: 'G5', modelNum: 'A1076/A1145' },
      { year: '2004', size: '17"', chip: 'G5', modelNum: 'A1058' },
      { year: '2004', size: '20"', chip: 'G5', modelNum: 'A1076' },
      { year: '2002-2004', size: '15"-20"', chip: 'G4 (Flat Panel)', modelNum: 'M6498/A1065' },
      { year: '1998-2003', size: '15"', chip: 'G3 (CRT)', modelNum: 'M4984/M5521' },
    ],
  },
  imac_pro: {
    name: 'iMac Pro',
    variants: [
      { year: '2017', size: '27"', chip: 'Intel Xeon W (8-18 Core)', modelNum: 'A1862' },
    ],
  },
  mac_mini: {
    name: 'Mac mini',
    variants: [
      { year: '2024', size: 'N/A', chip: 'M4/M4 Pro' },
      { year: '2023', size: 'N/A', chip: 'M2/M2 Pro' },
      { year: '2020', size: 'N/A', chip: 'M1' },
      { year: '2018', size: 'N/A', chip: 'Intel i3/i5/i7', modelNum: 'A1993' },
      { year: '2014', size: 'N/A', chip: 'Intel i5/i7', modelNum: 'A1347' },
      { year: '2012', size: 'N/A', chip: 'Intel i5/i7', modelNum: 'A1347' },
      { year: '2011', size: 'N/A', chip: 'Intel i5/i7', modelNum: 'A1347' },
      { year: '2010', size: 'N/A', chip: 'Intel Core 2 Duo', modelNum: 'A1347' },
      { year: '2009', size: 'N/A', chip: 'Intel Core 2 Duo', modelNum: 'A1283' },
      { year: '2006-2007', size: 'N/A', chip: 'Intel Core Solo/Duo/Core 2 Duo', modelNum: 'A1176' },
      { year: '2005', size: 'N/A', chip: 'G4', modelNum: 'A1103' },
    ],
  },
  mac_studio: {
    name: 'Mac Studio',
    variants: [
      { year: '2024', size: 'N/A', chip: 'M4 Max/M4 Ultra' },
      { year: '2023', size: 'N/A', chip: 'M2 Max/M2 Ultra' },
      { year: '2022', size: 'N/A', chip: 'M1 Max/M1 Ultra' },
    ],
  },
  mac_pro: {
    name: 'Mac Pro',
    variants: [
      { year: '2023', size: 'N/A', chip: 'M2 Ultra' },
      { year: '2019', size: 'N/A', chip: 'Intel Xeon W (8-28 Core)', modelNum: 'A1991' },
      { year: '2013', size: 'N/A', chip: 'Intel Xeon E5 (Cylinder)', modelNum: 'A1481' },
      { year: '2010-2012', size: 'N/A', chip: 'Intel Xeon (Tower)', modelNum: 'A1289' },
      { year: '2006-2008', size: 'N/A', chip: 'Intel Xeon (Tower)', modelNum: 'A1186' },
      { year: '2003-2005', size: 'N/A', chip: 'G5 (Power Mac)', modelNum: 'A1047' },
    ],
  },
  ibook: {
    name: 'iBook',
    variants: [
      { year: '2003-2005', size: '12"', chip: 'G4', modelNum: 'A1054/A1133' },
      { year: '2003-2005', size: '14"', chip: 'G4', modelNum: 'A1055/A1134' },
      { year: '2001-2003', size: '12"/14"', chip: 'G3 (White)', modelNum: 'A1005/A1007' },
      { year: '1999-2000', size: '12"', chip: 'G3 (Clamshell)', modelNum: 'M2453/M6411' },
    ],
  },
  powerbook: {
    name: 'PowerBook G4',
    variants: [
      { year: '2003-2005', size: '12"', chip: 'G4', modelNum: 'A1010/A1104' },
      { year: '2003-2005', size: '15"', chip: 'G4 (Aluminum)', modelNum: 'A1046/A1138' },
      { year: '2003-2005', size: '17"', chip: 'G4', modelNum: 'A1013/A1139' },
      { year: '2001-2002', size: '15"', chip: 'G4 (Titanium)', modelNum: 'A1001/A1025' },
    ],
  },
  emac: {
    name: 'eMac',
    variants: [
      { year: '2002-2005', size: '17"', chip: 'G4', modelNum: 'A1002' },
    ],
  },
};

const PART_CATEGORIES = [
  { id: 'screen', name: 'Screen/Display', icon: '🖥️' },
  { id: 'lcd_assembly', name: 'LCD Assembly (Complete)', icon: '📺' },
  { id: 'display_cable', name: 'Display Cable', icon: '🔌' },
  { id: 'ram', name: 'RAM/Memory', icon: '🧠' },
  { id: 'ssd', name: 'SSD/Flash Storage', icon: '💾' },
  { id: 'hdd', name: 'Hard Drive (HDD)', icon: '📀' },
  { id: 'battery', name: 'Battery', icon: '🔋' },
  { id: 'keyboard', name: 'Keyboard', icon: '⌨️' },
  { id: 'topcase', name: 'Top Case/Palm Rest', icon: '🔲' },
  { id: 'trackpad', name: 'Trackpad', icon: '🖱️' },
  { id: 'logic_board', name: 'Logic Board', icon: '🔧' },
  { id: 'charger', name: 'Charger/Power Adapter', icon: '🔌' },
  { id: 'magsafe_board', name: 'MagSafe/USB-C Board', icon: '⚡' },
  { id: 'io_board', name: 'I/O Board', icon: '🔗' },
  { id: 'disk_drive', name: 'Optical/SuperDrive', icon: '💿' },
  { id: 'fan', name: 'Fan/Cooling', icon: '🌀' },
  { id: 'heatsink', name: 'Heatsink', icon: '♨️' },
  { id: 'speaker', name: 'Speaker', icon: '🔊' },
  { id: 'camera', name: 'Camera/FaceTime HD', icon: '📷' },
  { id: 'wifi_card', name: 'WiFi/Bluetooth Card', icon: '📶' },
  { id: 'antenna', name: 'Antenna', icon: '📡' },
  { id: 'hinge', name: 'Hinge/Clutch', icon: '🔩' },
  { id: 'bottom_case', name: 'Bottom Case', icon: '⬛' },
  { id: 'screws', name: 'Screws/Hardware Kit', icon: '🔩' },
  { id: 'glass_panel', name: 'Glass Panel (iMac)', icon: '🪟' },
  { id: 'stand', name: 'Stand/VESA Mount', icon: '🖼️' },
  { id: 'power_supply', name: 'Power Supply (Internal)', icon: '⚡' },
  { id: 'complete_unit', name: 'Complete Computer', icon: '💻' },
  { id: 'other', name: 'Other', icon: '📦' },
];

const CONDITIONS = ['New (OEM)', 'New (Aftermarket)', 'Refurbished', 'Pulled - Excellent', 'Pulled - Good', 'Pulled - Fair', 'For Parts/Repair'];

// API helper functions
const api = {
  async getInventory() {
    if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
      // Demo mode - use localStorage
      const saved = localStorage.getItem('mac_inventory_demo');
      return saved ? JSON.parse(saved) : [];
    }
    
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getAll`);
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      return [];
    }
  },

  async addItem(item) {
    if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
      // Demo mode
      const inventory = await this.getInventory();
      inventory.push(item);
      localStorage.setItem('mac_inventory_demo', JSON.stringify(inventory));
      return item;
    }

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', item }),
      });
      return item;
    } catch (error) {
      console.error('Failed to add item:', error);
      throw error;
    }
  },

  async updateItem(item) {
    if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
      // Demo mode
      const inventory = await this.getInventory();
      const index = inventory.findIndex(i => i.id === item.id);
      if (index !== -1) {
        inventory[index] = item;
        localStorage.setItem('mac_inventory_demo', JSON.stringify(inventory));
      }
      return item;
    }

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', item }),
      });
      return item;
    } catch (error) {
      console.error('Failed to update item:', error);
      throw error;
    }
  },

  async deleteItem(id) {
    if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
      // Demo mode
      const inventory = await this.getInventory();
      const filtered = inventory.filter(i => i.id !== id);
      localStorage.setItem('mac_inventory_demo', JSON.stringify(filtered));
      return true;
    }

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      });
      return true;
    } catch (error) {
      console.error('Failed to delete item:', error);
      throw error;
    }
  },
};

// Get sizes for a model
const getSizesForModel = (modelKey) => {
  if (!modelKey || !MAC_MODELS[modelKey]) return [];
  const sizes = new Set();
  MAC_MODELS[modelKey].variants.forEach(v => sizes.add(v.size));
  return Array.from(sizes);
};

export default function MacPartsInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [view, setView] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterModel, setFilterModel] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [scanMode, setScanMode] = useState(false);
  const [manualScanInput, setManualScanInput] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState(null);

  // Load inventory on mount
  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const items = await api.getInventory();
      setInventory(items);
    } catch (error) {
      showNotification('Failed to load inventory', 'error');
    }
    setLoading(false);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const generateItemId = () => {
    return 'MAC-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
  };

  const addItem = async (itemData) => {
    setSyncing(true);
    const newItem = {
      ...itemData,
      id: generateItemId(),
      dateAdded: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      status: 'available',
    };
    
    try {
      await api.addItem(newItem);
      setInventory([...inventory, newItem]);
      showNotification(`Added ${newItem.partName || newItem.category} to inventory`);
    } catch (error) {
      showNotification('Failed to add item', 'error');
    }
    setSyncing(false);
    return newItem;
  };

  const updateItem = async (id, updates) => {
    setSyncing(true);
    const updatedItem = {
      ...inventory.find(i => i.id === id),
      ...updates,
      lastModified: new Date().toISOString(),
    };
    
    try {
      await api.updateItem(updatedItem);
      setInventory(inventory.map(item => item.id === id ? updatedItem : item));
      showNotification('Item updated successfully');
    } catch (error) {
      showNotification('Failed to update item', 'error');
    }
    setSyncing(false);
  };

  const deleteItem = async (id) => {
    setSyncing(true);
    const item = inventory.find(i => i.id === id);
    
    try {
      await api.deleteItem(id);
      setInventory(inventory.filter(item => item.id !== id));
      showNotification(`Removed ${item?.partName || 'item'} from inventory`, 'warning');
    } catch (error) {
      showNotification('Failed to delete item', 'error');
    }
    setSyncing(false);
  };

  const checkOutItem = (id, jobInfo) => {
    updateItem(id, {
      status: 'checked_out',
      checkedOutTo: jobInfo,
      checkedOutDate: new Date().toISOString(),
    });
  };

  const checkInItem = (id) => {
    updateItem(id, {
      status: 'available',
      checkedOutTo: '',
      checkedOutDate: '',
    });
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.partName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.modelNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.chip?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesModel = filterModel === 'all' || item.macModel === filterModel;
    
    return matchesSearch && matchesCategory && matchesModel;
  });

  const stats = {
    total: inventory.length,
    available: inventory.filter(i => i.status !== 'checked_out').length,
    checkedOut: inventory.filter(i => i.status === 'checked_out').length,
    lowStock: inventory.filter(i => (parseInt(i.quantity) || 1) <= (parseInt(i.lowStockThreshold) || 1)).length,
    byCategory: PART_CATEGORIES.reduce((acc, cat) => {
      acc[cat.id] = inventory.filter(i => i.category === cat.id).length;
      return acc;
    }, {}),
  };

  const handleScanResult = (data) => {
    let searchId = data.trim();
    
    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(data);
      if (parsed.id) searchId = parsed.id;
    } catch (e) {
      // Not JSON, use as-is
    }
    
    const item = inventory.find(i => i.id === searchId);
    if (item) {
      setSelectedItem(item);
      setView('detail');
      showNotification(`Found: ${item.partName || item.id}`);
    } else {
      showNotification('Item not found in inventory', 'error');
    }
    setScanMode(false);
    setManualScanInput('');
  };

  const isConfigured = GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';

  return (
    <div style={styles.container}>
      {/* Notification Toast */}
      {notification && (
        <div style={{
          ...styles.notification,
          backgroundColor: notification.type === 'error' ? '#dc2626' : notification.type === 'warning' ? '#f59e0b' : '#10b981',
        }}>
          {notification.message}
        </div>
      )}

      {/* Syncing Indicator */}
      {syncing && (
        <div style={styles.syncIndicator}>
          Syncing with Google Sheets...
        </div>
      )}

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🍎</span>
            <div>
              <h1 style={styles.title}>Mac Parts Inventory</h1>
              <p style={styles.subtitle}>
                {isConfigured ? '✓ Connected to Google Sheets' : '⚠️ Demo Mode (localStorage)'}
              </p>
            </div>
          </div>
          <nav style={styles.nav}>
            <button 
              style={view === 'dashboard' ? styles.navButtonActive : styles.navButton}
              onClick={() => setView('dashboard')}
            >
              Dashboard
            </button>
            <button 
              style={view === 'inventory' ? styles.navButtonActive : styles.navButton}
              onClick={() => setView('inventory')}
            >
              Inventory
            </button>
            <button 
              style={view === 'add' ? styles.navButtonActive : styles.navButton}
              onClick={() => { setView('add'); setEditingItem(null); }}
            >
              + Add
            </button>
            <button 
              style={styles.scanButton}
              onClick={() => setScanMode(true)}
            >
              📷 Scan
            </button>
            <button 
              style={styles.refreshButton}
              onClick={loadInventory}
              disabled={loading}
            >
              🔄
            </button>
          </nav>
        </div>
      </header>

      <main style={styles.main}>
        {loading ? (
          <div style={styles.loadingState}>
            <div style={styles.spinner}></div>
            <p>Loading inventory...</p>
          </div>
        ) : (
          <>
            {/* Dashboard View */}
            {view === 'dashboard' && (
              <div style={styles.dashboard}>
                {!isConfigured && (
                  <div style={styles.setupBanner}>
                    <h3>📋 Setup Required</h3>
                    <p>This app is running in demo mode. To connect to Google Sheets:</p>
                    <ol style={{ textAlign: 'left', margin: '10px 0' }}>
                      <li>Create a Google Sheet with the template</li>
                      <li>Add the Apps Script code</li>
                      <li>Deploy as web app</li>
                      <li>Update GOOGLE_SCRIPT_URL in App.jsx</li>
                    </ol>
                    <p style={{ fontSize: '12px', color: '#999' }}>See README.md for detailed instructions</p>
                  </div>
                )}

                <div style={styles.statsGrid}>
                  <div style={styles.statCard}>
                    <div style={styles.statIcon}>📦</div>
                    <div style={styles.statNumber}>{stats.total}</div>
                    <div style={styles.statLabel}>Total Items</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={styles.statIcon}>✅</div>
                    <div style={styles.statNumber}>{stats.available}</div>
                    <div style={styles.statLabel}>Available</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={styles.statIcon}>🔧</div>
                    <div style={styles.statNumber}>{stats.checkedOut}</div>
                    <div style={styles.statLabel}>Checked Out</div>
                  </div>
                  <div style={{ ...styles.statCard, borderColor: stats.lowStock > 0 ? '#f59e0b' : '#333' }}>
                    <div style={styles.statIcon}>⚠️</div>
                    <div style={{ ...styles.statNumber, color: stats.lowStock > 0 ? '#f59e0b' : '#fff' }}>{stats.lowStock}</div>
                    <div style={styles.statLabel}>Low Stock</div>
                  </div>
                </div>

                <div style={styles.categoryGrid}>
                  <h2 style={styles.sectionTitle}>Inventory by Category</h2>
                  <div style={styles.categoryCards}>
                    {PART_CATEGORIES.filter(cat => stats.byCategory[cat.id] > 0).map(cat => (
                      <div 
                        key={cat.id} 
                        style={styles.categoryCard}
                        onClick={() => { setFilterCategory(cat.id); setView('inventory'); }}
                      >
                        <span style={styles.categoryIcon}>{cat.icon}</span>
                        <span style={styles.categoryName}>{cat.name}</span>
                        <span style={styles.categoryCount}>{stats.byCategory[cat.id]}</span>
                      </div>
                    ))}
                    {Object.values(stats.byCategory).every(v => v === 0) && (
                      <p style={{ color: '#666', padding: '20px' }}>No items yet. Add your first part!</p>
                    )}
                  </div>
                </div>

                <div style={styles.recentSection}>
                  <h2 style={styles.sectionTitle}>Recently Added</h2>
                  <div style={styles.recentList}>
                    {inventory.length === 0 ? (
                      <p style={{ color: '#666', padding: '20px' }}>No items yet. Click "+ Add" to get started.</p>
                    ) : (
                      inventory
                        .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
                        .slice(0, 5)
                        .map(item => (
                          <div 
                            key={item.id} 
                            style={styles.recentItem}
                            onClick={() => { setSelectedItem(item); setView('detail'); }}
                          >
                            <span style={styles.recentIcon}>
                              {PART_CATEGORIES.find(c => c.id === item.category)?.icon || '📦'}
                            </span>
                            <div style={styles.recentInfo}>
                              <div style={styles.recentName}>{item.partName || item.id}</div>
                              <div style={styles.recentMeta}>
                                {item.macModel && MAC_MODELS[item.macModel]?.name} {item.screenSize} {item.year}
                              </div>
                            </div>
                            <div style={styles.recentDate}>
                              {new Date(item.dateAdded).toLocaleDateString()}
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Inventory List View */}
            {view === 'inventory' && (
              <div style={styles.inventoryView}>
                <div style={styles.filterBar}>
                  <input
                    type="text"
                    placeholder="Search by name, ID, model #..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={styles.searchInput}
                  />
                  <select 
                    value={filterCategory} 
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={styles.filterSelect}
                  >
                    <option value="all">All Categories</option>
                    {PART_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                  <select 
                    value={filterModel} 
                    onChange={(e) => setFilterModel(e.target.value)}
                    style={styles.filterSelect}
                  >
                    <option value="all">All Mac Models</option>
                    {Object.entries(MAC_MODELS).map(([key, model]) => (
                      <option key={key} value={key}>{model.name}</option>
                    ))}
                  </select>
                </div>

                <div style={styles.inventoryGrid}>
                  {filteredInventory.length === 0 ? (
                    <div style={styles.emptyState}>
                      <div style={styles.emptyIcon}>📭</div>
                      <p>No items found</p>
                      <button style={styles.primaryButton} onClick={() => setView('add')}>
                        Add Your First Item
                      </button>
                    </div>
                  ) : (
                    filteredInventory.map(item => (
                      <div 
                        key={item.id} 
                        style={{
                          ...styles.inventoryCard,
                          borderLeft: item.status === 'checked_out' ? '4px solid #f59e0b' : '4px solid #10b981',
                        }}
                        onClick={() => { setSelectedItem(item); setView('detail'); }}
                      >
                        <div style={styles.cardHeader}>
                          <span style={styles.cardIcon}>
                            {PART_CATEGORIES.find(c => c.id === item.category)?.icon || '📦'}
                          </span>
                          <span style={styles.cardId}>{item.id}</span>
                        </div>
                        <h3 style={styles.cardTitle}>{item.partName || PART_CATEGORIES.find(c => c.id === item.category)?.name}</h3>
                        <div style={styles.cardSpecs}>
                          {item.macModel && <span>{MAC_MODELS[item.macModel]?.name}</span>}
                          {item.screenSize && item.screenSize !== 'N/A' && <span>{item.screenSize}</span>}
                          {item.year && <span>{item.year}</span>}
                        </div>
                        {item.chip && <div style={styles.cardChip}>{item.chip}</div>}
                        {item.modelNumber && <div style={styles.cardModelNum}>Model: {item.modelNumber}</div>}
                        {item.capacity && <div style={styles.cardSpec}>{item.capacity}</div>}
                        <div style={styles.cardFooter}>
                          <span style={{
                            ...styles.statusBadge,
                            backgroundColor: item.status === 'checked_out' ? '#f59e0b' : '#10b981',
                          }}>
                            {item.status === 'checked_out' ? 'Out' : 'In Stock'}
                          </span>
                          <span style={styles.cardQty}>Qty: {item.quantity || 1}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Add/Edit Item View */}
            {view === 'add' && (
              <AddItemForm 
                onAdd={async (data) => {
                  if (editingItem) {
                    await updateItem(editingItem.id, data);
                    setEditingItem(null);
                  } else {
                    await addItem(data);
                  }
                  setView('inventory');
                }}
                editingItem={editingItem}
                onCancel={() => { setView('inventory'); setEditingItem(null); }}
              />
            )}

            {/* Item Detail View */}
            {view === 'detail' && selectedItem && (
              <div style={styles.detailView}>
                <button style={styles.backButton} onClick={() => setView('inventory')}>
                  ← Back to Inventory
                </button>
                
                <div style={styles.detailCard}>
                  <div style={styles.detailHeader}>
                    <div>
                      <span style={styles.detailIcon}>
                        {PART_CATEGORIES.find(c => c.id === selectedItem.category)?.icon || '📦'}
                      </span>
                      <h2 style={styles.detailTitle}>
                        {selectedItem.partName || PART_CATEGORIES.find(c => c.id === selectedItem.category)?.name}
                      </h2>
                      <p style={styles.detailId}>{selectedItem.id}</p>
                    </div>
                    <div style={styles.qrContainer}>
                      <img 
                        src={generateQRCode(selectedItem.id, 120)} 
                        alt="QR Code"
                        style={styles.qrImage}
                      />
                      <button 
                        style={styles.printButton}
                        onClick={() => setShowQRModal(true)}
                      >
                        🖨️ Print Label
                      </button>
                    </div>
                  </div>

                  <div style={styles.detailGrid}>
                    <div style={styles.detailSection}>
                      <h3 style={styles.detailSectionTitle}>Compatibility</h3>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Mac Model:</span>
                        <span style={styles.detailValue}>{MAC_MODELS[selectedItem.macModel]?.name || '-'}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Screen Size:</span>
                        <span style={styles.detailValue}>{selectedItem.screenSize || '-'}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Year:</span>
                        <span style={styles.detailValue}>{selectedItem.year || '-'}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Chip:</span>
                        <span style={styles.detailValue}>{selectedItem.chip || '-'}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Model #:</span>
                        <span style={styles.detailValue}>{selectedItem.modelNumber || '-'}</span>
                      </div>
                    </div>

                    <div style={styles.detailSection}>
                      <h3 style={styles.detailSectionTitle}>Specifications</h3>
                      {selectedItem.capacity && (
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>Capacity:</span>
                          <span style={styles.detailValue}>{selectedItem.capacity}</span>
                        </div>
                      )}
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Condition:</span>
                        <span style={styles.detailValue}>{selectedItem.condition || '-'}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Quantity:</span>
                        <span style={styles.detailValue}>{selectedItem.quantity || 1}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Location:</span>
                        <span style={styles.detailValue}>{selectedItem.location || '-'}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Cost:</span>
                        <span style={styles.detailValue}>{selectedItem.cost ? `$${selectedItem.cost}` : '-'}</span>
                      </div>
                    </div>

                    <div style={styles.detailSection}>
                      <h3 style={styles.detailSectionTitle}>Status</h3>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Status:</span>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: selectedItem.status === 'checked_out' ? '#f59e0b' : '#10b981',
                        }}>
                          {selectedItem.status === 'checked_out' ? 'Checked Out' : 'Available'}
                        </span>
                      </div>
                      {selectedItem.checkedOutTo && (
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>Checked Out To:</span>
                          <span style={styles.detailValue}>{selectedItem.checkedOutTo}</span>
                        </div>
                      )}
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Supplier:</span>
                        <span style={styles.detailValue}>{selectedItem.supplier || '-'}</span>
                      </div>
                    </div>

                    {selectedItem.notes && (
                      <div style={{ ...styles.detailSection, gridColumn: '1 / -1' }}>
                        <h3 style={styles.detailSectionTitle}>Notes</h3>
                        <p style={styles.notes}>{selectedItem.notes}</p>
                      </div>
                    )}
                  </div>

                  <div style={styles.detailActions}>
                    {selectedItem.status === 'checked_out' ? (
                      <button 
                        style={styles.checkInButton}
                        onClick={() => {
                          checkInItem(selectedItem.id);
                          setSelectedItem({ ...selectedItem, status: 'available', checkedOutTo: '' });
                        }}
                      >
                        ✓ Check In
                      </button>
                    ) : (
                      <button 
                        style={styles.checkOutButton}
                        onClick={() => {
                          const job = prompt('Enter job/customer reference:');
                          if (job) {
                            checkOutItem(selectedItem.id, job);
                            setSelectedItem({ ...selectedItem, status: 'checked_out', checkedOutTo: job });
                          }
                        }}
                      >
                        ↗ Check Out
                      </button>
                    )}
                    <button 
                      style={styles.editButton}
                      onClick={() => { setEditingItem(selectedItem); setView('add'); }}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      style={styles.deleteButton}
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this item?')) {
                          deleteItem(selectedItem.id);
                          setView('inventory');
                        }
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* QR Print Modal */}
      {showQRModal && selectedItem && (
        <div style={styles.modal} onClick={() => setShowQRModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Print Label</h3>
            <div style={styles.labelPreview}>
              <div style={styles.labelContent}>
                <img 
                  src={generateQRCode(selectedItem.id, 150)} 
                  alt="QR Code"
                  style={styles.labelQR}
                />
                <div style={styles.labelInfo}>
                  <div style={styles.labelId}>{selectedItem.id}</div>
                  <div style={styles.labelName}>
                    {selectedItem.partName || PART_CATEGORIES.find(c => c.id === selectedItem.category)?.name}
                  </div>
                  <div style={styles.labelMeta}>
                    {MAC_MODELS[selectedItem.macModel]?.name} {selectedItem.screenSize} {selectedItem.year}
                  </div>
                  {selectedItem.modelNumber && <div style={styles.labelModelNum}>Model: {selectedItem.modelNumber}</div>}
                  {selectedItem.capacity && <div style={styles.labelSpec}>{selectedItem.capacity}</div>}
                </div>
              </div>
            </div>
            <p style={styles.printInstructions}>
              Right-click → Save Image, or use Ctrl/Cmd + P to print
            </p>
            <button style={styles.closeButton} onClick={() => setShowQRModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Scan Modal */}
      {scanMode && (
        <div style={styles.modal} onClick={() => setScanMode(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>📷 Scan QR Code</h3>
            <p style={styles.scanInstructions}>
              Scan with your phone camera, then paste the result. Or enter an item ID directly.
            </p>
            <input
              type="text"
              placeholder="Paste scanned data or enter ID (MAC-...)"
              value={manualScanInput}
              onChange={(e) => setManualScanInput(e.target.value)}
              style={styles.scanInput}
              autoFocus
            />
            <div style={styles.scanActions}>
              <button 
                style={styles.primaryButton}
                onClick={() => handleScanResult(manualScanInput)}
              >
                Look Up
              </button>
              <button style={styles.cancelButton} onClick={() => setScanMode(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Add Item Form Component
function AddItemForm({ onAdd, editingItem, onCancel }) {
  const [formData, setFormData] = useState(editingItem || {
    category: '',
    macModel: '',
    screenSize: '',
    year: '',
    chip: '',
    modelNumber: '',
    partName: '',
    condition: 'Pulled - Good',
    quantity: '1',
    location: '',
    cost: '',
    supplier: '',
    notes: '',
    capacity: '',
    lowStockThreshold: '1',
  });

  const selectedModel = MAC_MODELS[formData.macModel];
  const availableSizes = getSizesForModel(formData.macModel);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div style={styles.addForm}>
      <h2 style={styles.formTitle}>{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGrid}>
          <div style={styles.formSection}>
            <h3 style={styles.formSectionTitle}>Part Type</h3>
            
            <label style={styles.label}>Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={styles.select}
              required
            >
              <option value="">Select category...</option>
              {PART_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>

            <label style={styles.label}>Part Name/Description</label>
            <input
              type="text"
              value={formData.partName}
              onChange={(e) => setFormData({ ...formData, partName: e.target.value })}
              style={styles.input}
              placeholder="e.g., Retina Display Assembly"
            />

            <label style={styles.label}>Capacity (if applicable)</label>
            <input
              type="text"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              style={styles.input}
              placeholder="e.g., 16GB, 512GB"
            />
          </div>

          <div style={styles.formSection}>
            <h3 style={styles.formSectionTitle}>Mac Compatibility</h3>
            
            <label style={styles.label}>Mac Model *</label>
            <select
              value={formData.macModel}
              onChange={(e) => setFormData({ 
                ...formData, 
                macModel: e.target.value,
                screenSize: '',
                year: '',
                chip: '',
                modelNumber: '',
              })}
              style={styles.select}
              required
            >
              <option value="">Select model...</option>
              {Object.entries(MAC_MODELS).map(([key, model]) => (
                <option key={key} value={key}>{model.name}</option>
              ))}
            </select>

            <label style={styles.label}>Screen Size</label>
            <select
              value={formData.screenSize}
              onChange={(e) => setFormData({ ...formData, screenSize: e.target.value })}
              style={styles.select}
            >
              <option value="">Select size...</option>
              {availableSizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>

            <label style={styles.label}>Year</label>
            <select
              value={formData.year}
              onChange={(e) => {
                const year = e.target.value;
                const variant = selectedModel?.variants.find(v => v.year === year && (!formData.screenSize || v.size === formData.screenSize));
                setFormData({ 
                  ...formData, 
                  year,
                  chip: variant?.chip || formData.chip,
                  modelNumber: variant?.modelNum || formData.modelNumber,
                });
              }}
              style={styles.select}
            >
              <option value="">Select year...</option>
              {selectedModel?.variants
                .filter(v => !formData.screenSize || v.size === formData.screenSize)
                .map(v => v.year)
                .filter((v, i, a) => a.indexOf(v) === i)
                .map(year => (
                  <option key={year} value={year}>{year}</option>
                ))
              }
            </select>

            <label style={styles.label}>Chip/Processor</label>
            <input
              type="text"
              value={formData.chip}
              onChange={(e) => setFormData({ ...formData, chip: e.target.value })}
              style={styles.input}
              placeholder="e.g., M1 Pro, Intel i7"
            />

            <label style={styles.label}>Model Number (A####)</label>
            <input
              type="text"
              value={formData.modelNumber}
              onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })}
              style={styles.input}
              placeholder="e.g., A1706, A1278"
            />
          </div>

          <div style={styles.formSection}>
            <h3 style={styles.formSectionTitle}>Inventory Details</h3>
            
            <label style={styles.label}>Condition</label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              style={styles.select}
            >
              {CONDITIONS.map(cond => (
                <option key={cond} value={cond}>{cond}</option>
              ))}
            </select>

            <label style={styles.label}>Quantity</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              style={styles.input}
              min="1"
            />

            <label style={styles.label}>Low Stock Alert At</label>
            <input
              type="number"
              value={formData.lowStockThreshold}
              onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
              style={styles.input}
              min="1"
            />

            <label style={styles.label}>Storage Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              style={styles.input}
              placeholder="e.g., Shelf A3, Bin 12"
            />

            <label style={styles.label}>Cost ($)</label>
            <input
              type="number"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              style={styles.input}
              step="0.01"
              placeholder="0.00"
            />

            <label style={styles.label}>Supplier</label>
            <input
              type="text"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              style={styles.input}
              placeholder="e.g., iFixit, eBay"
            />
          </div>

          <div style={{ ...styles.formSection, gridColumn: '1 / -1' }}>
            <label style={styles.label}>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              style={styles.textarea}
              rows={3}
              placeholder="Any additional notes..."
            />
          </div>
        </div>

        <div style={styles.formActions}>
          <button type="submit" style={styles.submitButton}>
            {editingItem ? 'Update Item' : 'Add to Inventory'}
          </button>
          <button type="button" style={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// Styles
const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" },
  notification: { position: 'fixed', top: '20px', right: '20px', padding: '12px 24px', borderRadius: '8px', color: '#fff', fontWeight: '500', zIndex: 1000, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' },
  syncIndicator: { position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', padding: '8px 16px', borderRadius: '8px', background: '#3b82f6', color: '#fff', fontSize: '12px', zIndex: 1000 },
  header: { background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)', borderBottom: '1px solid #333', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 100 },
  headerContent: { maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' },
  logo: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoIcon: { fontSize: '32px' },
  title: { margin: 0, fontSize: '20px', fontWeight: '600', color: '#fff' },
  subtitle: { margin: 0, fontSize: '12px', color: '#666' },
  nav: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  navButton: { padding: '8px 16px', border: '1px solid #333', borderRadius: '8px', background: 'transparent', color: '#999', cursor: 'pointer', fontSize: '14px' },
  navButtonActive: { padding: '8px 16px', border: '1px solid #fff', borderRadius: '8px', background: '#fff', color: '#000', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  scanButton: { padding: '8px 16px', border: 'none', borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  refreshButton: { padding: '8px 12px', border: '1px solid #333', borderRadius: '8px', background: 'transparent', color: '#999', cursor: 'pointer', fontSize: '14px' },
  main: { maxWidth: '1400px', margin: '0 auto', padding: '24px' },
  loadingState: { textAlign: 'center', padding: '60px', color: '#666' },
  spinner: { width: '40px', height: '40px', border: '3px solid #333', borderTop: '3px solid #3b82f6', borderRadius: '50%', margin: '0 auto 20px', animation: 'spin 1s linear infinite' },
  setupBanner: { background: 'linear-gradient(135deg, #1e3a5f 0%, #1a1a1a 100%)', border: '1px solid #3b82f6', borderRadius: '16px', padding: '24px', marginBottom: '24px', textAlign: 'center' },
  dashboard: { display: 'flex', flexDirection: 'column', gap: '32px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' },
  statCard: { background: 'linear-gradient(135deg, #1a1a1a 0%, #111 100%)', border: '1px solid #333', borderRadius: '16px', padding: '24px', textAlign: 'center' },
  statIcon: { fontSize: '32px', marginBottom: '8px' },
  statNumber: { fontSize: '36px', fontWeight: '700', color: '#fff' },
  statLabel: { fontSize: '14px', color: '#666', marginTop: '4px' },
  sectionTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#fff' },
  categoryGrid: {},
  categoryCards: { display: 'flex', flexWrap: 'wrap', gap: '12px' },
  categoryCard: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', cursor: 'pointer' },
  categoryIcon: { fontSize: '20px' },
  categoryName: { fontSize: '14px', color: '#ccc' },
  categoryCount: { fontSize: '14px', fontWeight: '600', color: '#fff', background: '#333', padding: '2px 8px', borderRadius: '12px' },
  recentSection: {},
  recentList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  recentItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', cursor: 'pointer' },
  recentIcon: { fontSize: '24px' },
  recentInfo: { flex: 1 },
  recentName: { fontSize: '14px', fontWeight: '500', color: '#fff' },
  recentMeta: { fontSize: '12px', color: '#666' },
  recentDate: { fontSize: '12px', color: '#666' },
  inventoryView: { display: 'flex', flexDirection: 'column', gap: '24px' },
  filterBar: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  searchInput: { flex: '1 1 300px', padding: '12px 16px', border: '1px solid #333', borderRadius: '8px', background: '#1a1a1a', color: '#fff', fontSize: '14px' },
  filterSelect: { padding: '12px 16px', border: '1px solid #333', borderRadius: '8px', background: '#1a1a1a', color: '#fff', fontSize: '14px', cursor: 'pointer' },
  inventoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
  inventoryCard: { background: 'linear-gradient(135deg, #1a1a1a 0%, #111 100%)', border: '1px solid #333', borderRadius: '12px', padding: '16px', cursor: 'pointer' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  cardIcon: { fontSize: '24px' },
  cardId: { fontSize: '10px', color: '#666', fontFamily: 'monospace' },
  cardTitle: { fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#fff' },
  cardSpecs: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '4px', fontSize: '12px', color: '#999' },
  cardChip: { fontSize: '12px', color: '#10b981', marginBottom: '4px' },
  cardModelNum: { fontSize: '11px', color: '#666', marginBottom: '4px' },
  cardSpec: { fontSize: '14px', color: '#3b82f6', fontWeight: '500', marginBottom: '8px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #333' },
  statusBadge: { fontSize: '11px', padding: '4px 8px', borderRadius: '4px', fontWeight: '500', color: '#fff' },
  cardQty: { fontSize: '12px', color: '#666' },
  emptyState: { gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: '#666' },
  emptyIcon: { fontSize: '48px', marginBottom: '16px' },
  addForm: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '16px', padding: '24px' },
  formTitle: { fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: '#fff' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' },
  formSection: { display: 'flex', flexDirection: 'column', gap: '12px' },
  formSectionTitle: { fontSize: '14px', fontWeight: '600', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' },
  label: { fontSize: '12px', color: '#999', marginBottom: '-8px' },
  input: { padding: '10px 12px', border: '1px solid #333', borderRadius: '8px', background: '#0a0a0a', color: '#fff', fontSize: '14px' },
  select: { padding: '10px 12px', border: '1px solid #333', borderRadius: '8px', background: '#0a0a0a', color: '#fff', fontSize: '14px', cursor: 'pointer' },
  textarea: { padding: '10px 12px', border: '1px solid #333', borderRadius: '8px', background: '#0a0a0a', color: '#fff', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit' },
  formActions: { display: 'flex', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #333' },
  submitButton: { padding: '12px 24px', border: 'none', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  cancelButton: { padding: '12px 24px', border: '1px solid #333', borderRadius: '8px', background: 'transparent', color: '#999', fontSize: '14px', cursor: 'pointer' },
  primaryButton: { padding: '12px 24px', border: 'none', borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  detailView: {},
  backButton: { padding: '8px 16px', border: '1px solid #333', borderRadius: '8px', background: 'transparent', color: '#999', fontSize: '14px', cursor: 'pointer', marginBottom: '24px' },
  detailCard: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '16px', padding: '24px' },
  detailHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #333', flexWrap: 'wrap', gap: '16px' },
  detailIcon: { fontSize: '48px', display: 'block', marginBottom: '8px' },
  detailTitle: { fontSize: '24px', fontWeight: '600', margin: '0 0 4px 0', color: '#fff' },
  detailId: { fontSize: '14px', color: '#666', fontFamily: 'monospace', margin: 0 },
  qrContainer: { textAlign: 'center' },
  qrImage: { borderRadius: '8px', marginBottom: '8px' },
  printButton: { padding: '8px 16px', border: '1px solid #333', borderRadius: '8px', background: 'transparent', color: '#999', fontSize: '12px', cursor: 'pointer' },
  detailGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '24px' },
  detailSection: {},
  detailSectionTitle: { fontSize: '12px', fontWeight: '600', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' },
  detailRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #222' },
  detailLabel: { fontSize: '13px', color: '#666' },
  detailValue: { fontSize: '13px', color: '#fff', fontWeight: '500' },
  notes: { fontSize: '14px', color: '#ccc', lineHeight: '1.5', margin: 0 },
  detailActions: { display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '24px', borderTop: '1px solid #333' },
  checkOutButton: { padding: '12px 24px', border: 'none', borderRadius: '8px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  checkInButton: { padding: '12px 24px', border: 'none', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  editButton: { padding: '12px 24px', border: '1px solid #333', borderRadius: '8px', background: 'transparent', color: '#fff', fontSize: '14px', cursor: 'pointer' },
  deleteButton: { padding: '12px 24px', border: '1px solid #dc2626', borderRadius: '8px', background: 'transparent', color: '#dc2626', fontSize: '14px', cursor: 'pointer' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 1000 },
  modalContent: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '16px', padding: '24px', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflow: 'auto' },
  modalTitle: { fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#fff' },
  labelPreview: { background: '#fff', borderRadius: '8px', padding: '16px', marginBottom: '16px' },
  labelContent: { display: 'flex', gap: '16px', alignItems: 'center' },
  labelQR: { flexShrink: 0 },
  labelInfo: { color: '#000' },
  labelId: { fontSize: '12px', fontFamily: 'monospace', color: '#666', marginBottom: '4px' },
  labelName: { fontSize: '16px', fontWeight: '600', marginBottom: '4px' },
  labelMeta: { fontSize: '12px', color: '#666', marginBottom: '4px' },
  labelModelNum: { fontSize: '11px', color: '#666', marginBottom: '2px' },
  labelSpec: { fontSize: '14px', color: '#3b82f6', fontWeight: '500' },
  printInstructions: { fontSize: '12px', color: '#666', marginBottom: '16px' },
  closeButton: { width: '100%', padding: '12px 24px', border: '1px solid #333', borderRadius: '8px', background: 'transparent', color: '#fff', fontSize: '14px', cursor: 'pointer' },
  scanInstructions: { fontSize: '14px', color: '#999', marginBottom: '16px' },
  scanInput: { width: '100%', padding: '12px 16px', border: '1px solid #333', borderRadius: '8px', background: '#0a0a0a', color: '#fff', fontSize: '14px', marginBottom: '16px', boxSizing: 'border-box' },
  scanActions: { display: 'flex', gap: '12px' },
};

// Add keyframe animation for spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
document.head.appendChild(styleSheet);
