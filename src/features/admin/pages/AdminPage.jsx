import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/v1/admin';

function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newMenu, setNewMenu] = useState({
    itemName: '',
    itemCode: '',
    category: '',
    price: '',
    description: '',
    imageUrl: '',
    available: true
  });
  const [showAddMenu, setShowAddMenu] = useState(false);

  useEffect(() => {
    if (activeTab === 'dashboard') fetchStats();
    if (activeTab === 'reservations') fetchReservations();
    if (activeTab === 'tables') fetchTables();
    if (activeTab === 'menu') fetchMenuItems();
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await axios.get(`${API_BASE}/reservations`);
      setReservations(response.data.content);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const fetchTables = async () => {
    try {
      const response = await axios.get(`${API_BASE}/tables`);
      setTables(response.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/menu');
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const deleteReservation = async (id) => {
    try {
      await axios.delete(`${API_BASE}/reservations/${id}`);
      fetchReservations();
      fetchStats(); // Refresh stats after deletion
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  const updateTableStatus = async (id, status) => {
    try {
      await axios.put(`${API_BASE}/tables/${id}/status`, null, { params: { status } });
      fetchTables();
      fetchStats(); // Refresh stats after table status update
    } catch (error) {
      console.error('Error updating table status:', error);
    }
  };

  const deleteMenuItem = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/menu/${id}`);
      fetchMenuItems();
      fetchStats(); // Refresh stats after deletion
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  const addMenuItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/menu', newMenu);
      fetchMenuItems();
      fetchStats(); // Refresh stats after addition
      setShowAddMenu(false);
      setNewMenu({ itemName: '', itemCode: '', category: '', price: '', description: '', imageUrl: '', available: true });
    } catch (error) {
      console.error('Error adding menu item:', error);
    }
  };

  const initializeMenuItems = async () => {
    try {
      await axios.post('http://localhost:8080/api/menu/initialize');
      fetchMenuItems();
      fetchStats();
      alert('Menu items initialized successfully');
    } catch (error) {
      console.error('Error initializing menu items:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/admin/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:8080/api/v1/admin/orders/${id}/status`, null, { params: { status } });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const deleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/admin/orders/${id}`);
      fetchOrders();
      fetchStats(); // Refresh stats after deletion
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const expireOldReservations = async () => {
    try {
      const response = await axios.post(`${API_BASE}/reservations/expire`);
      alert(`${response.data.expiredCount} reservations expired successfully`);
      fetchReservations();
      fetchStats(); // Refresh stats after expiring
    } catch (error) {
      console.error('Error expiring reservations:', error);
      alert('Failed to expire reservations');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
        
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'dashboard' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'orders' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'reservations' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'
            }`}
          >
            Reservations
          </button>
          <button
            onClick={() => setActiveTab('tables')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'tables' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'
            }`}
          >
            Tables
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'menu' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'
            }`}
          >
            Menu Items
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Total Reservations</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalReservations}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Total Tables</h3>
              <p className="text-3xl font-bold text-green-600">{stats.totalTables}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Total Menu Items</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.totalMenuItems}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Available Tables</h3>
              <p className="text-3xl font-bold text-green-500">{stats.availableTables}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Booked Tables</h3>
              <p className="text-3xl font-bold text-yellow-500">{stats.bookedTables}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Occupied Tables</h3>
              <p className="text-3xl font-bold text-red-500">{stats.occupiedTables}</p>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">All Orders</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.orderId || order.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{order.orderId || order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{order.customerName || 'Guest'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">₹{order.totalAmount?.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs ${
                            order.status === 'PLACED' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                            order.status === 'PREPARING' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'READY' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'DELIVERED' ? 'bg-gray-100 text-gray-800' :
                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-1">
                            <button
                              onClick={() => updateOrderStatus(order.orderId || order.id, 'PLACED')}
                              className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                            >
                              Placed
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order.orderId || order.id, 'CONFIRMED')}
                              className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                            >
                              Confirmed
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order.orderId || order.id, 'PREPARING')}
                              className="px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600"
                            >
                              Preparing
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order.orderId || order.id, 'READY')}
                              className="px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600"
                            >
                              Ready
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order.orderId || order.id, 'DELIVERED')}
                              className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                            >
                              Delivered
                            </button>
                            <button
                              onClick={() => deleteOrder(order.orderId || order.id)}
                              className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">All Reservations</h2>
                <button
                  onClick={expireOldReservations}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Expire Old Reservations
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guests</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reservations.map((reservation) => (
                      <tr key={reservation.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{reservation.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{reservation.customerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{reservation.reservationDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{reservation.reservationTime}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{reservation.numberOfGuests}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs ${
                            reservation.status === 'BOOKED' ? 'bg-yellow-100 text-yellow-800' :
                            reservation.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                            reservation.status === 'ON_GOING' ? 'bg-blue-100 text-blue-800' :
                            reservation.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                            reservation.status === 'COMPLETED' ? 'bg-purple-100 text-purple-800' :
                            reservation.status === 'EXPIRED' ? 'bg-gray-100 text-gray-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {reservation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => deleteReservation(reservation.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tables Tab */}
        {activeTab === 'tables' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">All Tables</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tables.map((table) => (
                  <div key={table.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">Table {table.tableNumber}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        table.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                        table.status === 'BOOKED' ? 'bg-yellow-100 text-yellow-800' :
                        table.status === 'OCCUPIED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {table.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Capacity: {table.capacity}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateTableStatus(table.id, 'AVAILABLE')}
                        className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                      >
                        Available
                      </button>
                      <button
                        onClick={() => updateTableStatus(table.id, 'BOOKED')}
                        className="px-2 py-1 bg-yellow-500 text-white rounded text-xs"
                      >
                        Booked
                      </button>
                      <button
                        onClick={() => updateTableStatus(table.id, 'OCCUPIED')}
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                      >
                        Occupied
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Menu Items Tab */}
        {activeTab === 'menu' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Menu Items</h2>
                <div className="flex space-x-2">
                  <button onClick={initializeMenuItems} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
                    Initialize Default Menu
                  </button>
                  <button onClick={() => setShowAddMenu(!showAddMenu)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    {showAddMenu ? 'Cancel' : 'Add New Item'}
                  </button>
                </div>
              </div>

              {showAddMenu && (
                <div className="mb-6 bg-gray-50 p-4 rounded-lg border">
                  <h3 className="text-lg font-medium mb-3">Add New Menu Item</h3>
                  <form onSubmit={addMenuItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Item Name" required className="border p-2 rounded" value={newMenu.itemName} onChange={e => setNewMenu({...newMenu, itemName: e.target.value})} />
                    <input type="text" placeholder="Item Code (e.g. PIZ001)" required className="border p-2 rounded" value={newMenu.itemCode} onChange={e => setNewMenu({...newMenu, itemCode: e.target.value})} />
                    <input type="text" placeholder="Category" required className="border p-2 rounded" value={newMenu.category} onChange={e => setNewMenu({...newMenu, category: e.target.value})} />
                    <input type="number" step="0.01" placeholder="Price" required className="border p-2 rounded" value={newMenu.price} onChange={e => setNewMenu({...newMenu, price: e.target.value})} />
                    <input type="text" placeholder="Description" className="border p-2 rounded md:col-span-2" value={newMenu.description} onChange={e => setNewMenu({...newMenu, description: e.target.value})} />
                    <input type="text" placeholder="Image URL" className="border p-2 rounded md:col-span-2" value={newMenu.imageUrl} onChange={e => setNewMenu({...newMenu, imageUrl: e.target.value})} />
                    <div className="md:col-span-2">
                      <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Save Menu Item</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Available</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {menuItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{item.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.itemName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.itemCode}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${item.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs ${
                            item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.available ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => deleteMenuItem(item.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
