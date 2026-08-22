const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#1E293B]">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-slate-400 hover:text-slate-700"
          >
            ×
          </button>
        </div>

        {children}

      </div>
    </div>
  );
};

export default Modal;