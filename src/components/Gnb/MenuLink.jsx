import { Link } from 'react-router-dom';

function MenuLink({ to, title, desc, Icon, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-gray-100"
    >
      <div className="flex items-center gap-4">
        <div className="bg-[#d5e3ff]/70 w-[54px] h-[54px] flex items-center justify-center rounded-full">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="font-medium mb-1">{title}</span>
          <span className="text-gray-400 text-sm">{desc}</span>
        </div>
      </div>
      <span className="text-gray-400">›</span>
    </Link>
  );
}

export default MenuLink;
