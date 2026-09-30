import React from 'react';
import { announcements } from '../../data/navigation';

export const AnnouncementBar = () => {
  // Repeat array multiple times for continuous seamless scrolling
  const items = [...announcements, ...announcements, ...announcements, ...announcements];

  return (
    <div className="bg-slate-950 text-white py-2 border-b border-[#c81e2b]/50 select-none overflow-hidden whitespace-nowrap shadow-xs">
      <marquee
        behavior="scroll"
        direction="left"
        scrollamount="5"
        className="w-full uppercase font-bold tracking-widest text-[11px] sm:text-xs text-white"
      >
        {items.map((item, index) => (
          <span key={index} className="inline-block px-12 sm:px-24">
            {item.text}
          </span>
        ))}
      </marquee>
    </div>
  );
};

export default AnnouncementBar;


