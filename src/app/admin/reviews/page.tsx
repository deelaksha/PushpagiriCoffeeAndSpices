"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  Star, MessageCircle, CheckCircle, EyeOff, Flag, 
  Search, ShieldCheck, Trash2, Download
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

const RATING_DATA = [
  { name: '5 Stars', count: 85, color: '#166534' }, // darker green
  { name: '4 Stars', count: 22, color: '#22c55e' }, // green
  { name: '3 Stars', count: 8, color: '#facc15' },  // yellow
  { name: '2 Stars', count: 3, color: '#f97316' },  // orange
  { name: '1 Star', count: 2, color: '#ef4444' },   // red
];

const DUMMY_REVIEWS = [
  {
    id: 'REV-1001',
    customerName: 'Aarav Patel',
    customerAvatar: 'AP',
    productName: 'Pushpagiri Signature Arabica',
    productImage: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=100&q=80',
    rating: 5,
    date: '2023-11-12T10:30:00Z',
    status: 'Pending',
    verified: true,
    text: 'Absolutely incredible coffee. The aroma when opening the bag was amazing, and the taste is even better. Highly recommend the signature blend!',
  },
  {
    id: 'REV-1002',
    customerName: 'Priya Sharma',
    customerAvatar: 'PS',
    productName: 'Coorg Black Pepper',
    productImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100&q=80',
    rating: 4,
    date: '2023-11-10T14:15:00Z',
    status: 'Published',
    verified: true,
    text: 'Very pungent and fresh black pepper. You can tell it\'s directly sourced. Knocking off one star because the packaging was slightly dented upon arrival, but the spices are perfect.',
  },
  {
    id: 'REV-1003',
    customerName: 'Rahul Desai',
    customerAvatar: 'RD',
    productName: 'Cardamom Pods (Premium)',
    productImage: 'https://images.unsplash.com/photo-1600857321590-b99b3806fb76?w=100&q=80',
    rating: 1,
    date: '2023-11-08T09:20:00Z',
    status: 'Flagged',
    verified: false,
    text: 'Never received my order. I have emailed support twice with no response. I demand a refund!',
  },
  {
    id: 'REV-1004',
    customerName: 'Neha Gupta',
    customerAvatar: 'NG',
    productName: 'Chikmagalur Filter Coffee Blend',
    productImage: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=100&q=80',
    rating: 5,
    date: '2023-11-05T16:45:00Z',
    status: 'Published',
    verified: true,
    text: 'Reminds me of my grandmother\'s filter coffee. Authentic taste, perfectly roasted chicory blend. Will definitely buy again.',
  },
  {
    id: 'REV-1005',
    customerName: 'Vikram Singh',
    customerAvatar: 'VS',
    productName: 'Cinnamon Sticks',
    productImage: 'https://images.unsplash.com/photo-1506195729707-c5a53be40ce7?w=100&q=80',
    rating: 3,
    date: '2023-11-01T11:10:00Z',
    status: 'Pending',
    verified: true,
    text: 'Decent cinnamon but the sticks were quite small. Expected larger quills based on the photos. Flavor is good though.',
  }
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "w-4 h-4",
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          )}
        />
      ))}
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  switch(status) {
    case 'Published':
      return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold border border-emerald-200">Published</span>;
    case 'Pending':
      return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold border border-amber-200">Pending Approval</span>;
    case 'Flagged':
      return <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold border border-red-200">Flagged</span>;
    default:
      return <span className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold border border-gray-200">{status}</span>;
  }
};

export default function ReviewsPage() {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviews, setReviews] = useState(DUMMY_REVIEWS);

  const filteredReviews = reviews.filter(review => {
    const matchesFilter = filter === 'All' || review.status === filter;
    const matchesSearch = review.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          review.productName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApprove = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'Published' } : r));
    toast.success(`Review ${id} has been approved and published.`);
  };

  const handleHide = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'Pending' } : r));
    toast.info(`Review ${id} has been hidden from the storefront.`);
  };

  const handleReply = (id: string) => {
    toast.success(`Reply sent to customer for review ${id}.`);
  };

  const handleFlag = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'Flagged' } : r));
    toast.warning(`Review ${id} has been flagged for further review.`);
  };

  const handleDelete = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    toast.success(`Review ${id} deleted permanently.`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-zinc-50 min-h-[calc(100vh-4rem)] rounded-tl-3xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-green-dark">Customer Reviews</h1>
          <p className="text-gray-600 mt-1">Manage and moderate customer feedback across your store.</p>
        </div>
        <button 
          onClick={() => toast.success("Exported reviews to CSV")}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-brand-green-dark rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium"
        >
          <Download className="w-4 h-4" />
          Export Reviews
        </button>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Stat Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Store Average</h3>
          <div className="text-6xl font-bold text-brand-green-dark mb-4">4.8</div>
          <StarRating rating={5} />
          <p className="text-sm text-gray-500 mt-4">Based on 120 total reviews</p>
        </div>

        {/* Right Chart Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Rating Breakdown</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={RATING_DATA} 
                layout="vertical" 
                margin={{ top: 0, right: 30, bottom: 0, left: -20 }}
              >
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#4b5563', fontSize: 13, fontWeight: 500 }}
                  width={80} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                  {RATING_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex space-x-1 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {['All', 'Pending', 'Published', 'Flagged'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                "px-5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center",
                filter === tab 
                  ? "bg-brand-green-dark text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {tab}
              {tab === 'Pending' && <span className={cn("ml-2 text-xs py-0.5 px-2 rounded-full", filter === tab ? "bg-white/20 text-white" : "bg-amber-100 text-amber-800")}>{reviews.filter(r => r.status === 'Pending').length}</span>}
              {tab === 'Flagged' && <span className={cn("ml-2 text-xs py-0.5 px-2 rounded-full", filter === tab ? "bg-white/20 text-white" : "bg-red-100 text-red-800")}>{reviews.filter(r => r.status === 'Flagged').length}</span>}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-green-light focus:border-brand-green-light sm:text-sm transition-colors"
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredReviews.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-cream mb-4">
                <MessageCircle className="h-8 w-8 text-brand-green-dark/50" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No reviews found</h3>
              <p className="text-gray-500">We couldn't find any reviews matching your criteria.</p>
            </motion.div>
          ) : (
            filteredReviews.map((review, i) => (
              <motion.div
                layout
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  
                  {/* Reviewer Info */}
                  <div className="md:w-1/4 flex-shrink-0 flex flex-col items-start gap-3 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-4">
                    <div className="flex items-center gap-3 w-full">
                      <div className="h-12 w-12 rounded-full bg-brand-cream text-brand-green-dark flex items-center justify-center font-bold text-lg border border-brand-green-dark/10">
                        {review.customerAvatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {review.customerName}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          {review.verified ? (
                            <span className="flex items-center text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-md">
                              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                              Verified Buyer
                            </span>
                          ) : (
                            <span className="bg-gray-50 px-1.5 py-0.5 rounded-md">Unverified</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 font-medium">
                      {new Date(review.date).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <StarRating rating={review.rating} />
                      <StatusBadge status={review.status} />
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4 bg-brand-cream/30 p-2.5 rounded-xl w-fit pr-5 border border-brand-cream">
                      <img 
                        src={review.productImage} 
                        alt={review.productName} 
                        className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                      />
                      <span className="text-sm font-semibold text-gray-800">{review.productName}</span>
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">
                      "{review.text}"
                    </p>

                    {/* Actions */}
                    <div className="mt-auto flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                      {review.status === 'Pending' && (
                        <button 
                          onClick={() => handleApprove(review.id)}
                          className="flex items-center px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-1.5" />
                          Approve & Publish
                        </button>
                      )}
                      
                      {review.status === 'Published' && (
                        <button 
                          onClick={() => handleHide(review.id)}
                          className="flex items-center px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                        >
                          <EyeOff className="w-4 h-4 mr-1.5" />
                          Hide Review
                        </button>
                      )}

                      <button 
                        onClick={() => handleReply(review.id)}
                        className="flex items-center px-4 py-2 bg-brand-cream text-brand-green-dark hover:bg-[#ebdaba] rounded-lg text-sm font-semibold transition-colors border border-[#e5d5b5] shadow-sm"
                      >
                        <MessageCircle className="w-4 h-4 mr-1.5" />
                        Reply
                      </button>

                      {review.status !== 'Flagged' && (
                        <button 
                          onClick={() => handleFlag(review.id)}
                          className="flex items-center px-4 py-2 text-gray-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg text-sm font-semibold transition-colors ml-auto"
                        >
                          <Flag className="w-4 h-4 mr-1.5" />
                          Flag
                        </button>
                      )}
                      
                      {review.status === 'Flagged' && (
                        <button 
                          onClick={() => handleDelete(review.id)}
                          className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-semibold transition-colors ml-auto"
                        >
                          <Trash2 className="w-4 h-4 mr-1.5" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
