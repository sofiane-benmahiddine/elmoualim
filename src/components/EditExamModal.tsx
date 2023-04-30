import NiceModal, {
  type NiceModalHocProps,
  useModal,
} from "@ebay/nice-modal-react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Inter } from "next/font/google";
import { useState } from "react";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

interface INiceModalHocProps extends NiceModalHocProps {
  title: string;
}

export default NiceModal.create((props: INiceModalHocProps) => {
  const modal = useModal();
  const [examTitle, setExamTitle] = useState<string>(props.title);
  return (
    <div
      className={`md:inset-0np fixed left-0 right-0 top-0 z-50 flex h-full max-h-full items-center justify-center overflow-y-auto overflow-x-hidden bg-black/30 p-4 backdrop-blur-sm ${inter.variable} font-sans`}
    >
      <div className="max-h-full w-full max-w-md">
        <div className="divide-y divide-slate-300 rounded-sm bg-white  shadow">
          <div className="flex justify-between p-3">
            <label htmlFor="title" className="block text-lg">
              Edit title:
            </label>
            <button
              type="button"
              className="right-1 top-1 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-lg text-gray-400 hover:bg-gray-200 hover:text-gray-900"
              onClick={() => {
                modal.remove();
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="flex flex-col gap-2 rounded-sm p-4">
            <input
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              id="title"
              placeholder="Write your title here..."
              className="block w-full rounded-sm border border-slate-300 bg-slate-50 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="flex justify-center">
              <button
                type="button"
                className="mr-2 inline-flex items-center rounded-sm bg-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 "
                onClick={() => {
                  modal.resolve(examTitle);
                  modal.remove();
                }}
              >
                Update
              </button>
              <button
                type="button"
                className="rounded-sm border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200"
                onClick={() => {
                  modal.remove();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
