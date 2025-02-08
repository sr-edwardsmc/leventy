import React, { useState, useEffect, useRef, ReactNode } from "react";

const Modal: React.FC<{
  children: ReactNode;
  opened: boolean;
  handleClose: () => void;
}> = ({ children, opened, handleClose }) => {
  const trigger = useRef<any>(null);
  const modal = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!modal.current) return;
      if (
        !opened ||
        modal.current.contains(target) ||
        trigger.current?.contains(target)
      )
        return;
      handleClose();
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!opened || keyCode !== 27) return;
      handleClose();
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <>
      <div
        className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${
          opened ? "block" : "hidden"
        }`}
      >
        <div
          ref={modal}
          className="w-full max-w-142.5 rounded-lg bg-white px-8 py-12 text-center dark:bg-boxdark md:px-17.5 md:py-15"
        >
          {children}
        </div>
      </div>
    </>
  );
};

export { Modal };
