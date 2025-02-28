const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <button onClick={onClose} className="float-right text-2xl">
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
