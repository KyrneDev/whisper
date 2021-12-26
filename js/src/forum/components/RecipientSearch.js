import Search from 'flarum/forum/components/Search';
import UserSearchSource from './UserSearchSource';
import ItemList from 'flarum/common/utils/ItemList';
import classList from 'flarum/common/utils/classList';
import extractText from 'flarum/common/utils/extractText';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import recipientLabel from './recipientLabel';
import Stream from 'flarum/common/utils/Stream';
import withAttr from 'flarum/common/utils/withAttr';
import app from 'flarum/forum/app';

export default class RecipientSearch extends Search {
  oninit(attrs) {
    this.value = Stream();
    super.oninit(attrs);
  }

  updateMaxHeight() {
    // stub
  }

  view() {
    if (typeof this.value() === 'undefined') {
      this.value('');
    }

    const loading = this.value() && this.value().length >= 3;

    if (!this.sources) {
      this.sources = this.sourceItems().toArray();
    }

    return (
      <div className="AddRecipientModal-body">
        {app.cache.conversationsRecipient === null ? (
          <div className="AddRecipientModal-form-input">
            <input
              className={classList('RecipientsInput FormControl', {
                open: !!this.value(),
                focused: !!this.value(),
                active: !!this.value(),
                loading: !!this.loadingSources,
              })}
              config={function (element) {
                element.focus();
              }}
              type="search"
              placeholder={extractText(app.translator.trans('kyrne-whisper.forum.modal.search_recipients'))}
              value={this.value()}
              oninput={withAttr('value', this.value)}
              onfocus={() => (this.hasFocus = true)}
              onblur={() => (this.hasFocus = false)}
              onkeyup={() => {
                clearTimeout(this.typingTimer);
                this.doSearch = false;
                this.typingTimer = setTimeout(() => {
                  this.doSearch = true;
                  m.redraw();
                }, 900);
              }}
              onkeydown={() => {
                clearTimeout(this.typingTimer);
              }}
            />
            <ul
              className={classList('Dropdown-menu Search-results fade', {
                in: !!loading,
              })}
              onclick={() => {
                const target = this.$('.SearchResult.active');

                this.addRecipient(target.data('index'));
                this.$('.RecipientsInput').trigger('focus');
              }}
            >
              {!this.doSearch
                ? LoadingIndicator.component({ size: 'tiny', className: 'Button Button--icon Button--link' })
                : this.sources.map((source) => source.view(this.value()))}
              <li>
                <span>{app.translator.trans('kyrne-whisper.forum.modal.more_users')}</span>
              </li>
            </ul>
          </div>
        ) : (
          <div className="RecipientsInput-selected RecipientsLabel">
            {recipientLabel(app.cache.conversationsRecipient, {
              onclick: () => {
                this.removeRecipient(app.cache.conversationsRecipient);
              },
            })}
          </div>
        )}
      </div>
    );
  }

  /**
   * Build an item list of SearchSources.
   *
   * @return {ItemList}
   */
  sourceItems() {
    const items = new ItemList();

    items.add('users', new UserSearchSource());

    return items;
  }

  /**
   * Clear the search input and the current controller's active search.
   */
  clear() {
    this.value('');

    m.redraw();
  }

  /**
   * Adds a recipient.
   *
   * @param value
   */
  addRecipient(value) {
    app.cache.conversationsRecipient = app.store.getById('users', value);

    this.clear();
  }

  /**
   * Removes a recipient.
   *
   * @param recipient
   */
  removeRecipient(recipient) {
    app.cache.conversationsRecipient = null;

    m.redraw();
  }

  /**
   * Loads a recipient from the global store.
   *
   * @param store
   * @param id
   * @returns {Model}
   */
  findRecipient(store, id) {
    return app.store.getById(store, id);
  }
}
