import { Notify } from 'quasar'

export function NotifyCreate(obj) {
  Notify.create({
    message: obj.title ? obj.title : obj.message,
    timeout: obj.timeout ? obj.timeout : 10000,
    type: obj.type ? obj.type : 'info',
    color: obj.color ? obj.color : 'primary',
    icon: obj.icon ? obj.icon : 'info',
    caption: obj.title ? obj.message : undefined,
    position: obj.position ? obj.position : 'bottom'
  });
}

export function showSuccess(message, timeout = 3000) {
  NotifyCreate({
    title: 'Success',
    type: 'positive',
    color: 'positive',
    icon: 'check_circle',
    timeout,
    message
  })
}

export function showError(message) {
  NotifyCreate({
    title: 'Error',
    type: 'negative',
    color: 'negative',
    icon: 'warning',
    message
  })
}
