import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Delete",
  confirmVariant = "danger",
}) {
  const confirmClass =
    confirmVariant === "danger" ? "btn-danger" : "btn-primary";

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  {title}
                </Dialog.Title>
                <p className="mt-2 text-sm text-gray-600">{message}</p>

                <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                  <button
                    type="button"
                    className="btn-secondary w-full sm:w-auto"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`${confirmClass} w-full sm:w-auto`}
                    onClick={onConfirm}
                  >
                    {confirmLabel}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default ConfirmModal;
