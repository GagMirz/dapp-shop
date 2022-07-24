 //@ts-ignore
import { NotificationManager } from 'react-notifications';

export default function Notification (type: string, massage:any) {
    let not;
    switch (type) {
        case 'info':
            not = NotificationManager.info('Info message', 3000);
          break;
        case 'success':
            not = NotificationManager.success(massage,'Success',  3000);
          break;
        case 'warning':
            not = NotificationManager.warning(massage,'Warning',  3000);
          break;
        case 'error':
            not = NotificationManager.error(massage.message, 'Error', 3000);
          break;
      
    };
    return not
}