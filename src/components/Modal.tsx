import { useEffect, useState } from 'react';
import { useDetectClickOutside } from 'react-detect-click-outside';

import NoAnimationButton from '@/components/buttons/Button';

const Modal: React.FC<Modal> = ({
  title,
  children,
  button,
  isOpen,
  notClose,
  callbackOpen,
}) => {
  const ref = useDetectClickOutside({
    onTriggered: () => callbackOpen(false),
  });
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);
  return (
    <>
      {open ? (
        <>
          <div
            className='animate-fade fixed inset-0 overflow-auto bg-black bg-opacity-50 transition-opacity'
            style={{
              zIndex: 10000,
            }}
          />
          <div
            style={{
              zIndex: 10001,
              fontFamily: 'Noto Sans KR',
            }}
            ref={ref}
            className='animate-fade fixed top-1/2 left-1/2 max-h-[70vh] w-[43rem] max-w-[90vw] -translate-y-1/2 -translate-x-1/2 overflow-auto rounded-xl bg-white'
          >
            <div className='flex w-full items-center p-5 text-2xl font-bold'>
              <span>{title}</span>
              {!notClose && (
                <i
                  onClick={() => callbackOpen(false)}
                  className='fas fa-times ml-auto cursor-pointer transition duration-300 ease-in-out hover:text-red-500'
                />
              )}
            </div>
            <hr className='w-full' />
            <div className='p-5'>{children}</div>
            <div className='sticky bottom-0 flex items-center justify-end border-t bg-white px-5 py-3'>
              <div>
                {!notClose && (
                  <NoAnimationButton
                    className='mr-2'
                    onClick={() => {
                      callbackOpen(false);
                    }}
                    variant='outline'
                  >
                    닫기
                  </NoAnimationButton>
                )}
                {button}
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

interface Modal {
  title: string;
  children: React.ReactNode;
  description?: string;
  button: React.ReactNode;
  isOpen: boolean;
  callbackOpen: (open: boolean) => void;
  notClose?: boolean;
}

export default Modal;