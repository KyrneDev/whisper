import Model from 'flarum/common/Model';
import mixin from 'flarum/common/utils/mixin';

export default class Conversation extends mixin(Model, {
  messages: Model.hasMany('messages'),
  recipients: Model.hasMany('recipients'),
  totalMessages: Model.attribute('totalMessages'),
  notNew: Model.attribute('notNew'),
  createdAt: Model.attribute('createdAt', Model.transformDate),
  updatedAt: Model.attribute('updatedAt', Model.transformDate),
}) {
  apiEndpoint() {
    return `/whisper/conversations${this.exists ? `/${this.data.id}` : ''}`;
  }
}
