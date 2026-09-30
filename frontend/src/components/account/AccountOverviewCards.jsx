import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiPackage,
  FiHeart,
  FiMapPin,
  FiUser,
  FiArrowRight,
} from 'react-icons/fi';
import { RiMotorbikeFill } from 'react-icons/ri';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';

export const AccountOverviewCards = ({ user }) => {
  const { totalWishlist = 0 } = useWishlist() || {};
  const { totalQuantity = 0 } = useCart() || {};

  const [orderCount, setOrderCount] = React.useState(0);

  React.useEffect(() => {
    import('../../services/orderService').then(({ orderService }) => {
      orderService
        .getOrders({ limit: 1 })
        .then((res) => {
          if (res && res.data && res.data.pagination) {
            const serverTotal = res.data.pagination.total || (res.data.orders?.length || 0);
            setOrderCount((prev) => Math.max(prev, serverTotal));
          }
        })
        .catch(() => {});
    });
  }, []);

  const cards = [
    {
      title: 'My Orders',
      description: 'Track ongoing shipments and view previous order history.',
      count: `${orderCount} Orders`,
      icon: FiPackage,
      path: '/account/orders',
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      title: 'Saved Wishlist',
      description: 'Review saved parts and accessories for your next ride.',
      count: `${totalWishlist} Items`,
      icon: FiHeart,
      path: '/wishlist',
      color: 'bg-rose-50 text-rose-600 border-rose-200',
    },
    {
      title: 'Saved Garage',
      description: 'Set your motorcycle make and model for automatic fitment matching.',
      count: '1 Active Bike',
      icon: RiMotorbikeFill,
      path: '/shop',
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    {
      title: 'Delivery Addresses',
      description: 'Manage home, workshop, and office shipping destinations.',
      count: `${user?.addresses?.length || 0} Saved`,
      icon: FiMapPin,
      path: '/account/addresses',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      title: 'Profile Information',
      description: 'Update your registered name, phone number, and avatar.',
      count: 'Active',
      icon: FiUser,
      path: '/account/profile',
      color: 'bg-purple-50 text-purple-600 border-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.title}
            to={card.path}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-brand-500/50 hover:shadow-elevated transition-all flex flex-col justify-between gap-4 group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border ${card.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {card.count}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                {card.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {card.description}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-600 pt-2 border-t border-slate-100">
              <span>View Details</span>
              <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default AccountOverviewCards;
