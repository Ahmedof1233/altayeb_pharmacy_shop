import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingCart, Phone, MapPin, Trash2, Calendar, MessageCircle, Clock, CheckCircle2, Truck, AlertTriangle } from 'lucide-react';

export default function OrdersTable() {
  const { orders, updateOrderStatus, deleteOrder } = useApp();
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredOrders = orders.filter(o => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'جديد':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            جديد
          </span>
        );
      case 'قيد التجهيز':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            قيد التجهيز
          </span>
        );
      case 'تم التوصيل':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            تم التوصيل
          </span>
        );
      case 'ملغي':
        return (
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 text-xs font-bold px-2.5 py-1 rounded-full">
            ملغي
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  const handleDelete = (orderId, orderNum) => {
    if (window.confirm(`هل أنت متأكد من حذف الطلب رقم ${orderNum}؟`)) {
      deleteOrder(orderId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top filter bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-500">تصفية حسب الحالة:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === 'all'
                  ? 'bg-saudi-700 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              الكل ({orders.length})
            </button>
            <button
              onClick={() => setFilterStatus('جديد')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === 'جديد'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              جديد ({orders.filter(o => o.status === 'جديد').length})
            </button>
            <button
              onClick={() => setFilterStatus('قيد التجهيز')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === 'قيد التجهيز'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              قيد التجهيز
            </button>
            <button
              onClick={() => setFilterStatus('تم التوصيل')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === 'تم التوصيل'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              تم التوصيل
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-500 font-medium">
          إجمالي الطلبات الواردة: <strong className="text-gray-900 font-bold">{orders.length}</strong> طلب
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm" dir="rtl">
            <thead className="bg-gray-50 text-gray-600 font-bold text-[11px] sm:text-xs border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-4">رقم الطلب</th>
                <th className="py-3.5 px-4">العميل</th>
                <th className="py-3.5 px-4">الجوال والتواصل</th>
                <th className="py-3.5 px-4">العنوان</th>
                <th className="py-3.5 px-4">المنتج المطلوب</th>
                <th className="py-3.5 px-4">الإجمالي</th>
                <th className="py-3.5 px-4">الحالة</th>
                <th className="py-3.5 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => {
                  // Format Clean Phone for WhatsApp
                  const rawPhone = order.phone.replace(/[^0-9]/g, '');
                  const waNumber = rawPhone.startsWith('05') ? `966${rawPhone.slice(1)}` : rawPhone;

                  return (
                    <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Order Number & Date */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-saudi-900 text-xs block">
                          {order.orderNumber}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                        </span>
                      </td>

                      {/* Customer Name */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-gray-900 block">
                          {order.customerName}
                        </span>
                      </td>

                      {/* Phone with WhatsApp and Direct Call */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-gray-700 text-xs">{order.phone}</span>
                          <a
                            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`مرحباً ${order.customerName}، نتواصل معك بخصوص طلبك من صيدلية الطيب رقم ${order.orderNumber}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                            title="محادثة واتساب"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      {/* Address */}
                      <td className="py-3.5 px-4 max-w-xs text-xs text-gray-600 leading-snug">
                        <div className="flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span>{order.address}</span>
                        </div>
                      </td>

                      {/* Product Ordered */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="font-bold text-gray-900 leading-tight">
                          {order.product.name}
                        </p>
                        <span className="text-[11px] text-gray-500">
                          الكمية: {order.quantity} × {order.product.finalPrice} ر.س
                        </span>
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4">
                        <span className="font-black text-saudi-700 font-tajawal text-sm">
                          {order.totalAmount} ر.س
                        </span>
                      </td>

                      {/* Status Selector Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="bg-gray-50 border border-gray-200 rounded-lg py-1 px-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-saudi-600"
                        >
                          <option value="جديد">جديد</option>
                          <option value="قيد التجهيز">قيد التجهيز</option>
                          <option value="تم التوصيل">تم التوصيل</option>
                          <option value="ملغي">ملغي</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleDelete(order.id, order.orderNumber)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف الطلب"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-400">
                    <ShoppingCart className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-gray-600 mb-1">لا توجد طلبات مسجلة بعد</p>
                    <p className="text-xs text-gray-400">
                      عندما يقوم العميل بالطلب عبر زر "اطلب الآن" في المتجر، سيظهر طلبه هنا فوراً
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
