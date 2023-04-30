import NiceModal, { useModal } from "@ebay/nice-modal-react";
import {
  faCircleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default NiceModal.create(() => {
  const modal = useModal();
  return (
    <div
      className={`md:inset-0np fixed left-0 right-0 top-0 z-50 flex h-full max-h-full items-center justify-center overflow-y-auto overflow-x-hidden bg-black/30 p-4 backdrop-blur-sm ${inter.variable} font-sans`}
    >
      <div className="relative max-h-full w-full max-w-md">
        <div className="relative rounded-sm bg-white shadow">
          <button
            type="button"
            className="absolute right-2.5 top-3 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-lg text-gray-400 hover:bg-gray-200 hover:text-gray-900"
            onClick={() => {
              modal.remove();
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-6 text-center">
            <div className="py-4 text-5xl text-red-500">
              <FontAwesomeIcon icon={faCircleExclamation} />
            </div>
            <h3 className="mb-5 font-normal text-gray-500 ">
              Are you sure you want to delete this Item?
            </h3>
            <button
              type="button"
              className="mr-2 inline-flex items-center rounded-sm bg-red-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 "
              onClick={() => {
                modal.resolve();
                modal.remove();
              }}
            >
              Yes, I&apos;m sure
            </button>
            <button
              type="button"
              className="rounded-sm border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200"
              onClick={() => {
                modal.remove();
              }}
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
