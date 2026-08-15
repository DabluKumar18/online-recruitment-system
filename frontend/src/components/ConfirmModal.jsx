import Modal from "./Modal";

export default function ConfirmModal({ open, onClose, onConfirm, title = "Are you sure?", description, confirmLabel = "Delete", loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      {description && <p className="text-sm text-ink-500 mb-6">{description}</p>}
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="btn-secondary">Cancel</button>
        <button onClick={onConfirm} disabled={loading} className="btn-danger">
          {loading ? "Please wait…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
