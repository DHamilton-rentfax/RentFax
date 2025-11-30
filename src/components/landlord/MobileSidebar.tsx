import LandlordSidebar from "./LandlordSidebar";

export default function MobileSidebar({ open, onClose }) {
  return (
    <div
      className={`fixed inset-0 bg-black/40 z-50 transition-opacity ${
        open ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white w-64 h-full absolute top-0 left-0 transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <LandlordSidebar />
      </div>
    </div>
  );
}
