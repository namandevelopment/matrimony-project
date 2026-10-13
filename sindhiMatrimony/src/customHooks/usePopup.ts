import { useCallback, useState } from 'react';

export type PopupType =
    | 'success'
    | 'error'
    | 'alert'
    | 'noInternet';

interface PopupState {
    visible: boolean;
    type: PopupType;
    title: string;
    message: string;
    onConfirm?: () => void;
}

interface ShowPopupProps {
    type: PopupType;
    title: string;
    message: string;
    onConfirm?: () => void;
}

export const usePopup = () => {
    const [popup, setPopup] = useState<PopupState>({
        visible: false,
        type: 'alert',
        title: '',
        message: '',
    });

    const showPopup = useCallback(
        ({
            type,
            title,
            message,
            onConfirm,
        }: ShowPopupProps) => {
            setPopup({
                visible: true,
                type,
                title,
                message,
                onConfirm,
            });
        },
        [],
    );

    const hidePopup = useCallback(() => {
        setPopup(prev => ({
            ...prev,
            visible: false,
        }));
    }, []);

    return {
        popup,
        showPopup,
        hidePopup,
    };
};




// const { popup, showPopup, hidePopup } = usePopup();

// showPopup({
//   type: 'error',
//   title: 'Error',
//   message: 'Something went wrong',
// });

// showPopup({
//   type: 'noInternet',
//   title: 'No Internet',
//   message: 'Please check your internet connection',
//   onConfirm: fetchData,
// });

// showPopup({
//   type: 'success',
//   title: 'Success',
//   message: 'Profile Updated Successfully',
// });

// showPopup({
//   type: 'error',
//   title: 'Error',
//   message: 'Something went wrong',
// });