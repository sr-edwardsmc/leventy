import {
  CloseIcon,
  ErrorNotificationIcon,
  SuccessNotificationIcon,
} from "../Icons";

interface NotificationProps {
  title: string;
  message: string;
  type: "success" | "error" | "warning";
  handleClose: () => void;
}

export const Notification = (props: NotificationProps) => {
  const { title, message, type, handleClose } = props;

  return (
    <section className="absolute bottom-4 right-4">
      {type === "success" && (
        <div className="p-4 sm:p-6 xl:p-10">
          <div className="max-w-[422px] rounded-lg py-4 pl-4 pr-4.5 shadow-2 dark:bg-meta-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-grow items-center gap-5">
                <div className="flex h-10 w-full max-w-10 items-center justify-center rounded-full bg-[#1EA779]">
                  <SuccessNotificationIcon />
                </div>
                <div>
                  <h4 className="mb-0.5 text-title-xsm font-medium text-black dark:text-white">
                    {title}
                  </h4>
                  <p className="text-sm font-medium">{message}</p>
                </div>
              </div>

              <div>
                <button>
                  <CloseIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {type === "error" && (
        <div className="p-4 sm:p-6 xl:p-10">
          <div className="max-w-[490px] relative rounded-lg border border-[#F5C5BB] bg-[#FCEDEA] py-4 pl-4 pr-5.5 shadow-2 dark:border-[#EA4E2C] dark:bg-[#1B1B24]">
            <div className="flex items-center justify-between ">
              <div className="flex flex-grow items-center gap-5">
                <div className="flex h-15 w-full max-w-15 items-center justify-center rounded-md bg-[#EA4E2C]">
                  <ErrorNotificationIcon />
                </div>
                <div>
                  <h4 className="mb-0.5 text-title-xsm font-medium text-black dark:text-[#EA4E2C]">
                    {title}
                  </h4>
                  <p className="text-sm font-medium">{message}</p>
                </div>
              </div>

              <div className="absolute top-2 right-2">
                <button
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-white dark:bg-meta-4"
                  onClick={handleClose}
                >
                  <CloseIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
