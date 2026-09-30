import React, { useState, useEffect, useRef } from 'react';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiCheck,
  FiAlertCircle,
  FiCamera,
  FiTrash2,
  FiUpload,
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import UserAvatar from '../account/UserAvatar';

export const ProfileForm = () => {
  const { user } = useAuth();
  const { saveProfile, uploadAvatar, removeAvatar, isUpdating, isUploadingAvatar } =
    useProfile();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
      });
      if (!selectedFile) {
        setAvatarPreview(user.avatar || null);
      }
    }
  }, [user, selectedFile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size: 2MB max
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size must be less than 2MB.');
      return;
    }

    // Validate mime type
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setError('Please choose a valid JPG, PNG, or WebP image.');
      return;
    }

    setError('');
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmAvatarUpload = async () => {
    if (!selectedFile) return;
    try {
      await uploadAvatar(selectedFile);
      setSelectedFile(null);
    } catch (err) {
      setError(err.message || 'Failed to upload photo.');
    }
  };

  const handleCancelAvatarSelection = () => {
    setSelectedFile(null);
    setAvatarPreview(user?.avatar || null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveAvatar = async () => {
    try {
      await removeAvatar();
      setSelectedFile(null);
      setAvatarPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError(err.message || 'Failed to remove avatar.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSaved(false);

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setError('Full name must be at least 2 characters long.');
      return;
    }

    try {
      // If a new avatar was selected, upload that too
      if (selectedFile) {
        await uploadAvatar(selectedFile);
        setSelectedFile(null);
      }

      await saveProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
      });

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl" noValidate>
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700 animate-fadeIn">
          <FiAlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="leading-snug">{error}</span>
        </div>
      )}

      {/* Profile Photo Section */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-5">
        <div className="relative group shrink-0">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt={user?.name || 'Rider Avatar'}
              className="w-20 h-20 rounded-full object-cover border-2 border-brand-400 shadow-md"
            />
          ) : (
            <UserAvatar user={user} size="xl" className="border-2 border-slate-300 shadow-md" />
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Upload profile photo"
            className="absolute bottom-0 right-0 p-1.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white shadow-md transition-transform hover:scale-105"
          >
            <FiCamera className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Profile Photo
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              JPG, PNG or WebP. Max file size: 2MB.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition-colors"
            >
              Change Photo
            </button>

            {selectedFile && (
              <button
                type="button"
                onClick={handleConfirmAvatarUpload}
                disabled={isUploadingAvatar}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <FiUpload className="w-3 h-3" />
                <span>{isUploadingAvatar ? 'Uploading...' : 'Save Photo'}</span>
              </button>
            )}

            {selectedFile && (
              <button
                type="button"
                onClick={handleCancelAvatarSelection}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            )}

            {(user?.avatar || avatarPreview) && !selectedFile && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                disabled={isUploadingAvatar}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 shadow-2xs flex items-center gap-1.5 transition-colors"
              >
                <FiTrash2 className="w-3 h-3" />
                <span>Remove</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information Fields */}
      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label
            htmlFor="profile-name"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FiUser className="w-4 h-4" />
            </div>
            <input
              id="profile-name"
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (error) setError('');
              }}
              placeholder="e.g. Rahul Sharma"
              className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-brand-500/20 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors"
            />
          </div>
        </div>

        {/* Email Address (Read Only) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="profile-email"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
            >
              Email Address
            </label>
            <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
              <FiLock className="w-3 h-3" /> Read-only
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FiMail className="w-4 h-4" />
            </div>
            <input
              id="profile-email"
              type="email"
              readOnly
              disabled
              value={formData.email}
              className="w-full bg-slate-100 border border-slate-200 text-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm cursor-not-allowed select-none"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Email changes are not available here.
          </p>
        </div>

        {/* Mobile Number */}
        <div>
          <label
            htmlFor="profile-phone"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Mobile Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FiPhone className="w-4 h-4" />
            </div>
            <input
              id="profile-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                if (error) setError('');
              }}
              placeholder="+91 98765 43210"
              className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-brand-500/20 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isUpdating}
          className={`py-2.5 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 focus:outline-none ${
            isSaved
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-brand-500 hover:bg-brand-600 text-white shadow-glow'
          }`}
        >
          {isUpdating ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : isSaved ? (
            <>
              <FiCheck className="w-4 h-4 stroke-[3]" />
              <span>Profile Updated!</span>
            </>
          ) : (
            <span>Save Profile Changes</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
