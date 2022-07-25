const { NotificationManager } = require('react-notifications');

export enum MessageType {
  INFO,
  SUCCESS,
  WARNING,
  ERROR
};

export function Notification(type: MessageType, massage: any) {
  let not;
  switch (type) {
    case MessageType.INFO:
      return NotificationManager.info('Info', 3000);
    case MessageType.SUCCESS:
      return NotificationManager.success(massage, 'Success', 3000);
    case MessageType.WARNING:
      return NotificationManager.warning(massage, 'Warning', 3000);
    case MessageType.ERROR:
      return NotificationManager.error(massage.message, 'Error', 3000);
  };
}