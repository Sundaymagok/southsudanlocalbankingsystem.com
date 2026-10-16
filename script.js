const STORAGE_USERS = 'sslbs_users';
const STORAGE_SESSION = 'sslbs_session';
const STORAGE_MESSAGES = 'sslbs_messages';
const STORAGE_UPDATES = 'sslbs_updates';
const STORAGE_READ_UPDATES = 'sslbs_read_updates';
const STORAGE_TRANSFERS = 'sslbs_transfers';
const STORAGE_BANK_PROFILE = 'sslbs_bank_profile';
const STORAGE_REGISTRATION_OPEN = 'sslbs_registration_open';
const STORAGE_CUSTOMER_COUNTS = 'sslbs_customer_counts';
const STORAGE_TIMELINE_POSTS = 'sslbs_timeline_posts';
const STORAGE_DELETED_USERS = 'sslbs_deleted_users';
const STORAGE_BRANCH_REQUESTS = 'sslbs_branch_requests';
const STORAGE_DIRECT_MESSAGES = 'sslbs_direct_messages';
const STORAGE_TRANSFER_NOTIFICATIONS = 'sslbs_transfer_notifications';
const STORAGE_READ_TRANSFER_NOTIFICATIONS = 'sslbs_read_transfer_notifications';
const OWNER_EMAIL = 'admin@sslbs.com';

const authScreen = document.getElementById('authScreen');
const chatScreen = document.getElementById('chatScreen');
const signupForm = document.getElementById('signupForm');
const signupBankName = document.getElementById('signupBankName');
const signupBankLocation = document.getElementById('signupBankLocation');
const signupBankLogo = document.getElementById('signupBankLogo');
const signupLogoPreview = document.getElementById('signupLogoPreview');
const registrationClosedNotice = document.getElementById('registrationClosedNotice');
const loginForm = document.getElementById('loginForm');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const messageList = document.getElementById('messageList');
const userList = document.getElementById('userList');
const welcomeName = document.getElementById('welcomeName');
const welcomeText = document.getElementById('welcomeText');
const logoutBtn = document.getElementById('logoutBtn');
const appNav = document.getElementById('appNav');
const notificationBadge = document.getElementById('notificationBadge');
const messageBadge = document.getElementById('messageBadge');
const updateForm = document.getElementById('updateForm');
const updateTitle = document.getElementById('updateTitle');
const updateText = document.getElementById('updateText');
const updateList = document.getElementById('updateList');
const homeUpdateList = document.getElementById('homeUpdateList');
const notificationBranchRequestList = document.getElementById('notificationBranchRequestList');
const mainBranchInvitationList = document.getElementById('mainBranchInvitationList');
const bankSearchForm = document.getElementById('bankSearchForm');
const bankSearchInput = document.getElementById('bankSearchInput');
const bankSearchResults = document.getElementById('bankSearchResults');
const bankProfile = document.getElementById('bankProfile');
const branchRequestList = document.getElementById('branchRequestList');
const directMessagePanel = document.getElementById('directMessagePanel');
const activityHistoryPanel = document.getElementById('activityHistoryPanel');
const activityHistoryContent = document.getElementById('activityHistoryContent');
const activityHistoryToggle = document.getElementById('activityHistoryToggle');
const transferForm = document.getElementById('transferForm');
const transferAmount = document.getElementById('transferAmount');
const receivedAmountPreview = document.getElementById('receivedAmountPreview');
const recentTransferList = document.getElementById('recentTransferList');
const historySearch = document.getElementById('historySearch');
const historyTableContainer = document.getElementById('historyTableContainer');
const bankProfileForm = document.getElementById('bankProfileForm');
const bankNameInput = document.getElementById('bankNameInput');
const bankLocationInput = document.getElementById('bankLocationInput');
const bankPhoneInput = document.getElementById('bankPhoneInput');
const bankWebsiteInput = document.getElementById('bankWebsiteInput');
const bankAddressInput = document.getElementById('bankAddressInput');
const bankAboutInput = document.getElementById('bankAboutInput');
const dailyCustomersInput = document.getElementById('dailyCustomersInput');
const postForm = document.getElementById('postForm');
const homePostForm = document.getElementById('homePostForm');
const timelinePosts = document.getElementById('timelinePosts');
const homeFeedPosts = document.getElementById('homeFeedPosts');
const settingsProfileForm = document.getElementById('settingsProfileForm');
const settingsFirstNameInput = document.getElementById('settingsFirstName');
const settingsSecondNameInput = document.getElementById('settingsSecondName');
const settingsBankNameInput = document.getElementById('settingsBankName');
const settingsBankLocationInput = document.getElementById('settingsBankLocation');
const settingsBankPhoneInput = document.getElementById('settingsBankPhone');
const settingsBankAddressInput = document.getElementById('settingsBankAddress');
const settingsBankWebsiteInput = document.getElementById('settingsBankWebsite');
const settingsBankAboutInput = document.getElementById('settingsBankAbout');
const settingsBankLogoInput = document.getElementById('settingsBankLogo');
const settingsLogoPreview = document.getElementById('settingsLogoPreview');
const settingsSaveStatus = document.getElementById('settingsSaveStatus');
const adminSettingsPanel = document.getElementById('adminSettingsPanel');
const registrationOpenToggle = document.getElementById('registrationOpenToggle');
const accountManagementList = document.getElementById('accountManagementList');
const deletedAccountManagementList = document.getElementById('deletedAccountManagementList');
const deleteAccountButton = document.getElementById('deleteAccountButton');
const deleteAccountPassword = document.getElementById('deleteAccountPassword');
const deleteAccountConfirm = document.getElementById('deleteAccountConfirm');
const deleteAccountDialog = document.getElementById('deleteAccountDialog');
const cancelAccountDeletion = document.getElementById('cancelAccountDeletion');
const confirmAccountDeletion = document.getElementById('confirmAccountDeletion');
const recoverAccountButton = document.getElementById('recoverAccountButton');
const transferDetailDialog = document.getElementById('transferDetailDialog');
const transferDetailContent = document.getElementById('transferDetailContent');
const sharePostDialog = document.getElementById('sharePostDialog');
const publicBankProfileDialog = document.getElementById('publicBankProfileDialog');
const publicBankProfileContent = document.getElementById('publicBankProfileContent');
let activeHistoryFilter = 'sent';
let activeDirectMessageMode = 'normal';
let activeDirectMoneyDirection = 'sent';
let selectedBankEmail = '';
let currentSharePost = null;

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_USERS) || '[]');
  } catch {
    return [];
  }
}

function getDeletedUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_DELETED_USERS) || '[]');
  } catch {
    return [];
  }
}

const PRESENCE_ACTIVE_WINDOW_MS = 5 * 60 * 1000;

function touchUserPresence(email) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return;
  const users = getUsers();
  const userIndex = users.findIndex(user => normalizeEmail(user.email) === normalizedEmail);
  if (userIndex === -1) return;
  users[userIndex].lastActive = Date.now();
  try {
    saveUsers(users);
  } catch {
    // Ignore write failures so the app remains usable and the status simply falls back to prior data.
  }
}

function getPresenceStatus(user) {
  if (!user) {
    return { isOnline: false, minutesAgo: 0, label: 'Offline • never' };
  }
  const lastActive = Number(user.lastActive || 0);
  if (!lastActive) {
    return { isOnline: false, minutesAgo: 0, label: 'Offline • never' };
  }
  const minutesAgo = Math.max(0, Math.round((Date.now() - lastActive) / 60000));
  const isOnline = Date.now() - lastActive <= PRESENCE_ACTIVE_WINDOW_MS;
  if (isOnline) {
    return { isOnline: true, minutesAgo, label: 'Active now' };
  }
  const formattedMinutes = minutesAgo || 1;
  return {
    isOnline: false,
    minutesAgo: formattedMinutes,
    label: `Offline • ${formattedMinutes} min${formattedMinutes === 1 ? '' : 's'} ago`
  };
}

function createPresenceStatus(user) {
  const status = getPresenceStatus(user);
  const row = document.createElement('div');
  row.className = 'presence-row';
  const dot = document.createElement('span');
  dot.className = `presence-dot ${status.isOnline ? 'online' : 'offline'}`;
  dot.setAttribute('aria-hidden', 'true');
  const label = document.createElement('span');
  label.className = 'presence-label';
  label.textContent = status.label;
  row.append(dot, label);
  return row;
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}

function saveDeletedUsers(users) {
  localStorage.setItem(STORAGE_DELETED_USERS, JSON.stringify(users));
}

function isRegistrationOpen() {
  return localStorage.getItem(STORAGE_REGISTRATION_OPEN) !== 'false';
}

function renderRegistrationAvailability() {
  const isOpen = isRegistrationOpen();
  signupForm.querySelector('button[type="submit"]').disabled = !isOpen;
  registrationClosedNotice.classList.toggle('hidden', isOpen);
}

function getBranchRequests() {
  return getStoredArray(STORAGE_BRANCH_REQUESTS);
}

function saveBranchRequests(requests) {
  localStorage.setItem(STORAGE_BRANCH_REQUESTS, JSON.stringify(requests));
}

function getDirectMessages() {
  return getStoredArray(STORAGE_DIRECT_MESSAGES);
}

function saveDirectMessages(messages) {
  localStorage.setItem(STORAGE_DIRECT_MESSAGES, JSON.stringify(messages));
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function findUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  return getUsers().find(user => normalizeEmail(user.email) === normalizedEmail);
}

function findTimelinePostAuthor(post) {
  if (post.authorEmail) return findUserByEmail(post.authorEmail);
  return getUsers().find(user => user.bankName === post.bankName) || null;
}

function getPublicBankName(user) {
  return user && user.bankName ? user.bankName : 'Bank name not provided';
}

function getPublicNameForLegacyRecord(name) {
  const matchedUser = getUsers().find(user => user.name === name);
  return matchedUser ? getPublicBankName(matchedUser) : name;
}

function findUserByCommentAuthor(authorName) {
  const normalizedName = String(authorName || '').trim().toLocaleLowerCase();
  return getUsers().find(user =>
    String(user.bankName || '').trim().toLocaleLowerCase() === normalizedName ||
    String(user.name || '').trim().toLocaleLowerCase() === normalizedName
  ) || null;
}

function createBankAuthorControl(user, displayName, avatar = null, options = {}) {
  if (!user) {
    const fallback = document.createElement('strong');
    fallback.textContent = `${displayName}: `;
    return fallback;
  }
  const wrap = document.createElement('span');
  wrap.className = 'post-author-wrap comment-author-wrap';
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'post-author-trigger';
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-label', `View ${getPublicBankName(user)} bank profile`);
  if (avatar) trigger.appendChild(avatar);
  trigger.appendChild(document.createTextNode(displayName || getPublicBankName(user)));
  trigger.addEventListener('click', () => openPublicBankProfile(user));

  const popover = document.createElement('div');
  popover.className = 'post-author-popover';
  const name = document.createElement('h4');
  name.textContent = getPublicBankName(user);
  const location = document.createElement('p');
  location.textContent = `Location: ${user.bankLocation || 'Not provided'}`;
  popover.append(name, location);

  const profileButton = document.createElement('button');
  profileButton.type = 'button';
  profileButton.className = 'post-author-message';
  profileButton.textContent = 'View bank profile';
  profileButton.addEventListener('click', () => openPublicBankProfile(user));
  popover.appendChild(profileButton);

  const currentUser = getSession();
  const messageButton = document.createElement('button');
  messageButton.type = 'button';
  messageButton.className = 'post-author-message';
  messageButton.textContent = 'Send message';
  messageButton.disabled = !canMessageBank(currentUser, user);
  if (currentUser && normalizeEmail(currentUser.email) === normalizeEmail(user.email)) {
    messageButton.textContent = 'Your bank';
  } else if (messageButton.disabled) {
    messageButton.textContent = 'Message after branch connection';
  }
  messageButton.addEventListener('click', () => {
    if (!canMessageBank(getSession(), user)) return;
    openDirectMessages(user);
  });
  popover.appendChild(messageButton);

  if (options.includeBranchAction && currentUser &&
      normalizeEmail(currentUser.email) !== normalizeEmail(user.email)) {
    const relationship = findBranchRelationship(currentUser.email, user.email);
    if (!relationship || relationship.status === 'declined') {
      const branchButton = document.createElement('button');
      branchButton.type = 'button';
      branchButton.className = 'post-author-message';
      branchButton.textContent = 'Add as branch';
      branchButton.addEventListener('click', () => sendBranchRequest(user));
      popover.appendChild(branchButton);
    } else if (relationship.status === 'pending' &&
        normalizeEmail(relationship.toEmail) === normalizeEmail(currentUser.email)) {
      const branchButton = document.createElement('button');
      branchButton.type = 'button';
      branchButton.className = 'post-author-message';
      branchButton.textContent = 'Accept branch invitation';
      branchButton.addEventListener('click', () => updateBranchRequest(relationship.id, 'accepted'));
      popover.appendChild(branchButton);
    } else if (relationship.status === 'pending') {
      const branchStatus = document.createElement('button');
      branchStatus.type = 'button';
      branchStatus.className = 'post-author-message';
      branchStatus.textContent = 'Branch invitation pending';
      branchStatus.disabled = true;
      popover.appendChild(branchStatus);
    }
  }
  wrap.append(trigger, popover);
  return wrap;
}

function openPublicBankProfile(user) {
  if (!user) return;
  const bankName = getPublicBankName(user);
  const bankPosts = getTimelinePosts()
    .filter(post => post.authorEmail
      ? normalizeEmail(post.authorEmail) === normalizeEmail(user.email)
      : post.bankName === bankName)
    .sort((first, second) => Number(second.timestamp) - Number(first.timestamp));
  publicBankProfileContent.replaceChildren();

  const cover = document.createElement('div');
  cover.className = 'public-bank-cover';
  cover.setAttribute('role', 'img');
  cover.setAttribute('aria-label', `${bankName} cover photo`);

  const identity = document.createElement('div');
  identity.className = 'public-bank-identity';
  const logo = user.bankLogo ? document.createElement('img') : document.createElement('span');
  logo.className = 'bank-profile-logo';
  if (user.bankLogo) {
    logo.src = user.bankLogo;
    logo.alt = `${bankName} logo`;
  } else {
    logo.textContent = bankName.charAt(0).toUpperCase();
    logo.setAttribute('aria-hidden', 'true');
  }
  const heading = document.createElement('h2');
  heading.id = 'publicBankProfileName';
  heading.textContent = bankName;
  identity.append(logo, heading);

  const actions = document.createElement('div');
  actions.className = 'profile-actions';
  const messageButton = document.createElement('button');
  messageButton.type = 'button';
  messageButton.className = 'profile-action primary';
  const currentUser = getSession();
  messageButton.disabled = !canMessageBank(currentUser, user);
  messageButton.textContent = canMessageBank(currentUser, user)
    ? 'Send message'
    : currentUser && normalizeEmail(currentUser.email) === normalizeEmail(user.email)
      ? 'Your bank'
      : 'Message after branch connection';
  messageButton.addEventListener('click', () => {
    if (!canMessageBank(getSession(), user)) return;
    publicBankProfileDialog.close();
    openDirectMessages(user);
  });
  actions.append(messageButton, createPresenceStatus(user));

  const details = document.createElement('div');
  details.className = 'public-bank-details';
  [
    ['Location', user.bankLocation],
    ['About', user.bankAbout],
    ['Phone', user.bankPhone],
    ['Address', user.bankAddress],
    ['Website', user.bankWebsite]
  ].forEach(([label, value]) => {
    if (!value) return;
    const detail = document.createElement('p');
    detail.textContent = `${label}: ${value}`;
    details.appendChild(detail);
  });

  const timelineHeading = document.createElement('h3');
  timelineHeading.textContent = `${bankName} timeline`;
  const timeline = document.createElement('div');
  timeline.className = 'public-bank-timeline';
  if (!bankPosts.length) {
    timeline.appendChild(makeEmptyState('This bank has not posted yet.'));
  }
  bankPosts.forEach(post => {
    const item = document.createElement('article');
    item.className = 'public-bank-post';
    if (post.text) {
      const text = document.createElement('p');
      text.textContent = post.text;
      item.appendChild(text);
    }
    if (post.image) {
      const image = document.createElement('img');
      image.src = post.image;
      image.alt = `Picture shared by ${bankName}`;
      item.appendChild(image);
    }
    const meta = document.createElement('span');
    meta.className = 'update-meta';
    meta.textContent = formatFullDate(post.timestamp);
    item.appendChild(meta);
    timeline.appendChild(item);
  });

  publicBankProfileContent.append(cover, identity, actions, details, timelineHeading, timeline);
  publicBankProfileDialog.showModal();
}

function getMessages() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_MESSAGES) || '[]');
  } catch {
    return [];
  }
}

function saveMessages(messages) {
  localStorage.setItem(STORAGE_MESSAGES, JSON.stringify(messages));
}

function getStoredArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function getTransfers() {
  return getStoredArray(STORAGE_TRANSFERS);
}

function saveTransfers(transfers) {
  localStorage.setItem(STORAGE_TRANSFERS, JSON.stringify(transfers));
}

function getTimelinePosts() {
  return getStoredArray(STORAGE_TIMELINE_POSTS);
}

function saveTimelinePosts(posts) {
  localStorage.setItem(STORAGE_TIMELINE_POSTS, JSON.stringify(posts));
}

function getBankProfile() {
  try {
    const profile = JSON.parse(localStorage.getItem(STORAGE_BANK_PROFILE) || 'null');
    if (profile && typeof profile === 'object' && !Array.isArray(profile)) {
      return {
        name: typeof profile.name === 'string' && profile.name.trim() ? profile.name : 'SSLBS Community Bank',
        location: typeof profile.location === 'string' ? profile.location : '',
        about: typeof profile.about === 'string' ? profile.about : '',
        phone: typeof profile.phone === 'string' ? profile.phone : '',
        address: typeof profile.address === 'string' ? profile.address : '',
        website: typeof profile.website === 'string' ? profile.website : ''
      };
    }
    return { name: 'SSLBS Community Bank', location: '', about: '', phone: '', address: '', website: '' };
  } catch {
    return { name: 'SSLBS Community Bank', location: '', about: '', phone: '', address: '', website: '' };
  }
}

function getCustomerCounts() {
  try {
    const counts = JSON.parse(localStorage.getItem(STORAGE_CUSTOMER_COUNTS) || '{}');
    return counts && typeof counts === 'object' && !Array.isArray(counts) ? counts : {};
  } catch {
    return {};
  }
}

function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatFullDate(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return 'Unknown date';
  return date.toLocaleString([], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatMoney(amount) {
  return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(amount)} SSP`;
}

function getUpdates() {
  try {
    const updates = JSON.parse(localStorage.getItem(STORAGE_UPDATES) || '[]');
    return Array.isArray(updates) ? updates : [];
  } catch {
    return [];
  }
}

function saveUpdates(updates) {
  localStorage.setItem(STORAGE_UPDATES, JSON.stringify(updates));
}

function getReadUpdates() {
  try {
    const readUpdates = JSON.parse(localStorage.getItem(STORAGE_READ_UPDATES) || '{}');
    return readUpdates && typeof readUpdates === 'object' && !Array.isArray(readUpdates)
      ? readUpdates
      : {};
  } catch {
    return {};
  }
}

function getTransferNotifications() {
  try {
    const notifications = JSON.parse(localStorage.getItem(STORAGE_TRANSFER_NOTIFICATIONS) || '[]');
    return Array.isArray(notifications) ? notifications : [];
  } catch {
    return [];
  }
}

function saveTransferNotifications(notifications) {
  localStorage.setItem(STORAGE_TRANSFER_NOTIFICATIONS, JSON.stringify(notifications));
}

function getReadTransferNotifications() {
  try {
    const readNotifications = JSON.parse(localStorage.getItem(STORAGE_READ_TRANSFER_NOTIFICATIONS) || '{}');
    return readNotifications && typeof readNotifications === 'object' && !Array.isArray(readNotifications)
      ? readNotifications
      : {};
  } catch {
    return {};
  }
}

function getUnreadUpdateCount(user) {
  const readUpdates = getReadUpdates();
  const readIds = Array.isArray(readUpdates[user.email]) ? readUpdates[user.email] : [];
  return getUpdates().filter(update => !readIds.includes(update.id)).length;
}

function getUnreadTransferNotificationCount(user) {
  if (!user) return 0;
  const readNotifications = getReadTransferNotifications();
  const readIds = Array.isArray(readNotifications[user.email]) ? readNotifications[user.email] : [];
  return getTransferNotifications().filter(notification =>
    normalizeEmail(notification.userEmail) === normalizeEmail(user.email) && !readIds.includes(notification.id)
  ).length;
}

function getUnreadMessageCount(user) {
  if (!user) return 0;
  return getDirectMessages().filter(message =>
    normalizeEmail(message.toEmail) === normalizeEmail(user.email) && message.read !== true
  ).length;
}

function getPendingBranchRequestCount(user) {
  if (!user) return 0;
  return getBranchRequests().filter(request =>
    request.status === 'pending' &&
    normalizeEmail(request.toEmail) === normalizeEmail(user.email)
  ).length;
}

function markUpdatesAsRead(user) {
  const updates = getUpdates();
  const readUpdates = getReadUpdates();
  readUpdates[user.email] = updates.map(update => update.id);
  localStorage.setItem(STORAGE_READ_UPDATES, JSON.stringify(readUpdates));
  renderNotificationBadge();
}

function markTransferNotificationsAsRead(user) {
  if (!user) return;
  const notifications = getTransferNotifications();
  const readNotifications = getReadTransferNotifications();
  readNotifications[user.email] = notifications
    .filter(notification => normalizeEmail(notification.userEmail) === normalizeEmail(user.email))
    .map(notification => notification.id);
  localStorage.setItem(STORAGE_READ_TRANSFER_NOTIFICATIONS, JSON.stringify(readNotifications));
  renderNotificationBadge();
}

function markDirectMessagesAsRead(user) {
  if (!user) return;
  const messages = getDirectMessages().map(message => (
    normalizeEmail(message.toEmail) === normalizeEmail(user.email)
      ? { ...message, read: true }
      : message
  ));
  saveDirectMessages(messages);
  renderMessageBadge();
}

function renderNotificationBadge() {
  const user = getSession();
  const count = user
    ? getUnreadUpdateCount(user) + getPendingBranchRequestCount(user) + getUnreadTransferNotificationCount(user)
    : 0;
  notificationBadge.textContent = count > 99 ? '99+' : String(count);
  notificationBadge.classList.toggle('hidden', count === 0);
}

function renderMessageBadge() {
  const user = getSession();
  const count = user ? getUnreadMessageCount(user) : 0;
  messageBadge.textContent = count > 99 ? '99+' : String(count);
  messageBadge.classList.toggle('hidden', count === 0);
}

function makeId() {
  return (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : 'id-' + Date.now() + '-' + Math.random().toString(16).slice(2);
}

function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('The selected bank logo could not be read.'));
    reader.readAsDataURL(file);
  });
}

function seedDemoAccount() {
  const users = getUsers();
  const demoAccountWasDeleted = getDeletedUsers().some(user => normalizeEmail(user.email) === OWNER_EMAIL);
  if (!users.length && !demoAccountWasDeleted) {
    users.push({
      id: makeId(),
      name: 'Admin SSLBS',
      email: 'admin@sslbs.com',
      password: 'admin123'
    });
    saveUsers(users);
  }
}

function setSession(user) {
  localStorage.setItem(STORAGE_SESSION, JSON.stringify(user));
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_SESSION) || 'null');
  } catch {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(STORAGE_SESSION);
}

function toggleAuthMode(mode) {
  const isSignup = mode === 'signup';
  document.querySelectorAll('.tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  signupForm.classList.toggle('hidden', !isSignup);
  loginForm.classList.toggle('hidden', isSignup);
}

function findBranchRelationship(firstEmail, secondEmail) {
  const first = normalizeEmail(firstEmail);
  const second = normalizeEmail(secondEmail);
  return getBranchRequests().find(request =>
    (normalizeEmail(request.fromEmail) === first && normalizeEmail(request.toEmail) === second) ||
    (normalizeEmail(request.fromEmail) === second && normalizeEmail(request.toEmail) === first)
  );
}

function isAcceptedBranchConnection(firstEmail, secondEmail) {
  const relationship = findBranchRelationship(firstEmail, secondEmail);
  return Boolean(relationship && relationship.status === 'accepted');
}

function canMessageBank(currentUser, user) {
  return Boolean(currentUser && user &&
    normalizeEmail(currentUser.email) !== normalizeEmail(user.email) &&
    isAcceptedBranchConnection(currentUser.email, user.email));
}

function renderSearchedBankProfile(user) {
  if (!user) {
    bankProfile.classList.add('hidden');
    bankProfile.replaceChildren();
    directMessagePanel.classList.add('hidden');
    selectedBankEmail = '';
    return;
  }

  const current = getSession();
  if (!current || normalizeEmail(current.email) === normalizeEmail(user.email)) return;
  selectedBankEmail = normalizeEmail(user.email);
  directMessagePanel.classList.add('hidden');
  bankProfile.classList.remove('hidden');
  bankProfile.replaceChildren();

  const heading = document.createElement('div');
  heading.className = 'bank-profile-heading';
  const logo = user.bankLogo ? document.createElement('img') : document.createElement('span');
  logo.className = 'bank-profile-logo';
  if (user.bankLogo) {
    logo.src = user.bankLogo;
    logo.alt = `${getPublicBankName(user)} logo`;
  } else {
    logo.textContent = getPublicBankName(user).charAt(0).toUpperCase();
    logo.setAttribute('aria-hidden', 'true');
  }
  const identity = document.createElement('div');
  const bankName = document.createElement('h3');
  bankName.textContent = getPublicBankName(user);
  identity.appendChild(bankName);
  heading.append(logo, identity);
  bankProfile.appendChild(heading);

  const presence = createPresenceStatus(user);
  bankProfile.appendChild(presence);

  const relationship = findBranchRelationship(current.email, user.email);
  const branchStatus = document.createElement('p');
  branchStatus.className = 'branch-status';
  if (relationship && relationship.status === 'accepted') {
    branchStatus.textContent = 'Branch connection accepted.';
  } else if (relationship && relationship.status === 'pending') {
    branchStatus.textContent = normalizeEmail(relationship.fromEmail) === normalizeEmail(current.email)
      ? 'Branch invitation sent; waiting for acceptance.'
      : 'This bank has invited you to connect as a branch.';
  } else {
    branchStatus.textContent = 'Not connected as branches. Send a branch invitation to start messaging.';
  }
  bankProfile.appendChild(branchStatus);

  const actions = document.createElement('div');
  actions.className = 'profile-actions';
  const messageButton = document.createElement('button');
  messageButton.type = 'button';
  messageButton.className = 'profile-action primary';
  messageButton.textContent = canMessageBank(current, user) ? '✉ Message' : 'Message after branch connection';
  messageButton.disabled = !canMessageBank(current, user);
  messageButton.addEventListener('click', () => {
    if (canMessageBank(getSession(), user)) openDirectMessages(user);
  });
  actions.appendChild(messageButton);

  if (relationship && relationship.status === 'pending' &&
      normalizeEmail(relationship.toEmail) === normalizeEmail(current.email)) {
    const acceptButton = document.createElement('button');
    acceptButton.type = 'button';
    acceptButton.className = 'profile-action';
    acceptButton.textContent = '✓ Accept branch request';
    acceptButton.addEventListener('click', () => updateBranchRequest(relationship.id, 'accepted'));
    actions.appendChild(acceptButton);
  } else if (!relationship || relationship.status === 'declined') {
    const branchButton = document.createElement('button');
    branchButton.type = 'button';
    branchButton.className = 'profile-action';
    branchButton.textContent = '＋ Add as branch';
    branchButton.addEventListener('click', () => sendBranchRequest(user));
    actions.appendChild(branchButton);
  }
  bankProfile.appendChild(actions);
}

function renderBankSearchResults(query) {
  const current = getSession();
  bankSearchResults.replaceChildren();
  if (!current || !query) return;

  const normalizedQuery = query.toLocaleLowerCase();
  const matches = getUsers().filter(user =>
    normalizeEmail(user.email) !== normalizeEmail(current.email) &&
    typeof user.bankName === 'string' &&
    user.bankName.toLocaleLowerCase().includes(normalizedQuery)
  );
  if (!matches.length) {
    bankSearchResults.appendChild(makeEmptyState(`No bank name found for "${query}".`));
    renderSearchedBankProfile(null);
    return;
  }

  matches.forEach(user => {
    const result = document.createElement('button');
    result.type = 'button';
    result.className = 'bank-search-result';
    const logo = user.bankLogo ? document.createElement('img') : document.createElement('span');
    logo.className = 'avatar';
    if (user.bankLogo) {
      logo.src = user.bankLogo;
      logo.alt = '';
    } else {
      logo.textContent = getPublicBankName(user).charAt(0).toUpperCase();
      logo.setAttribute('aria-hidden', 'true');
    }
    const details = document.createElement('span');
    details.className = 'bank-result-details';
    const name = document.createElement('strong');
    name.textContent = getPublicBankName(user);
    details.appendChild(name);
    result.append(logo, details);
    result.addEventListener('click', () => renderSearchedBankProfile(user));
    bankSearchResults.appendChild(result);
  });

  if (matches.length === 1) renderSearchedBankProfile(matches[0]);
}

function renderBranchRequests(container = branchRequestList, notificationsOnly = false) {
  const current = getSession();
  container.replaceChildren();
  if (!current) return;
  const relevant = getBranchRequests().filter(request =>
    (request.status === 'pending' || request.status === 'accepted') &&
    (normalizeEmail(request.toEmail) === normalizeEmail(current.email) ||
      normalizeEmail(request.fromEmail) === normalizeEmail(current.email)) &&
    (!notificationsOnly || request.status === 'accepted' ||
      normalizeEmail(request.toEmail) === normalizeEmail(current.email))
  );
  if (!relevant.length) {
    container.appendChild(makeEmptyState(notificationsOnly
      ? 'No branch requests or connections yet.'
      : 'No pending branch invitations.'));
    return;
  }

  relevant.forEach(request => {
    const incoming = normalizeEmail(request.toEmail) === normalizeEmail(current.email);
    const otherUser = findUserByEmail(incoming ? request.fromEmail : request.toEmail);
    if (!otherUser) return;
    const item = document.createElement('div');
    item.className = 'branch-request';
    const details = document.createElement('span');
    details.className = 'branch-request-details';
    const title = document.createElement('strong');
    title.textContent = otherUser.bankName || 'Bank name not provided';
    const subtitle = document.createElement('small');
    subtitle.textContent = request.status === 'accepted'
      ? 'Connected branch'
      : incoming
        ? `${getPublicBankName(otherUser)} invited your bank to connect.`
        : `Invitation sent to ${getPublicBankName(otherUser)}.`;
    details.append(title, subtitle);
    item.appendChild(details);
    if (incoming && request.status === 'pending') {
      const actions = document.createElement('div');
      actions.className = 'branch-request-actions';
      [['Accept', 'accepted', 'accept'], ['Decline', 'declined', 'decline']].forEach(([label, status, className]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `branch-request-action ${className}`;
        button.textContent = label;
        button.addEventListener('click', () => updateBranchRequest(request.id, status));
        actions.appendChild(button);
      });
      item.appendChild(actions);
    } else if (request.status === 'accepted') {
      const connectButton = document.createElement('button');
      connectButton.type = 'button';
      connectButton.className = 'branch-request-action accept';
      connectButton.textContent = 'Open chat & send money';
      connectButton.addEventListener('click', () => {
        setActiveView('home');
        renderSearchedBankProfile(otherUser);
        openDirectMessages(otherUser);
      });
      item.appendChild(connectButton);
    }
    container.appendChild(item);
  });
}

function sendBranchRequest(user) {
  const current = getSession();
  if (!current || !user) return;
  const existing = findBranchRelationship(current.email, user.email);
  if (existing && existing.status !== 'declined') return;
  const requests = getBranchRequests().filter(request =>
    !(request.status === 'declined' &&
      ((normalizeEmail(request.fromEmail) === normalizeEmail(current.email) &&
        normalizeEmail(request.toEmail) === normalizeEmail(user.email)) ||
       (normalizeEmail(request.fromEmail) === normalizeEmail(user.email) &&
        normalizeEmail(request.toEmail) === normalizeEmail(current.email))))
  );
  requests.push({
    id: makeId(),
    fromEmail: current.email,
    toEmail: user.email,
    status: 'pending',
    timestamp: Date.now()
  });
  try {
    saveBranchRequests(requests);
    renderSearchedBankProfile(user);
    renderBranchRequests();
    renderBranchRequests(mainBranchInvitationList);
    renderBranchRequests(notificationBranchRequestList, true);
    renderNotificationBadge();
  } catch {
    alert('The branch invitation could not be saved. Browser storage may be full.');
  }
}

function updateBranchRequest(requestId, status) {
  const requests = getBranchRequests();
  const request = requests.find(item => item.id === requestId);
  if (!request || !['accepted', 'declined'].includes(status)) {
    alert('This branch invitation could not be found.');
    return;
  }
  request.status = status;
  request.respondedAt = Date.now();
  try {
    saveBranchRequests(requests);
    renderBranchRequests();
    renderBranchRequests(mainBranchInvitationList);
    renderBranchRequests(notificationBranchRequestList, true);
    renderNotificationBadge();
    renderSearchedBankProfile(findUserByEmail(selectedBankEmail));
  } catch {
    alert('The branch invitation response could not be saved. Browser storage may be full.');
  }
}

function renderDirectMessages(user) {
  const current = getSession();
  if (!current || !user) return;
  const participants = [normalizeEmail(current.email), normalizeEmail(user.email)].sort();
  const transfers = getTransfers();
  const messages = getDirectMessages().filter(message =>
    participants.includes(normalizeEmail(message.fromEmail)) &&
    participants.includes(normalizeEmail(message.toEmail)) &&
    (activeDirectMessageMode === 'money'
      ? message.type === 'money' && (activeDirectMoneyDirection === 'sent'
        ? normalizeEmail(message.fromEmail) === normalizeEmail(current.email)
        : normalizeEmail(message.toEmail) === normalizeEmail(current.email))
      : message.type !== 'money')
  ).sort((first, second) => first.timestamp - second.timestamp);
  const list = directMessagePanel.querySelector('.direct-message-list');
  list.replaceChildren();
  if (!messages.length) {
    list.appendChild(makeEmptyState(activeDirectMessageMode === 'money'
      ? activeDirectMoneyDirection === 'sent'
        ? 'No money sent to this bank yet.'
        : 'No money received from this bank yet.'
      : 'No community chat messages yet. Start the conversation.'));
  } else {
    messages.forEach(message => {
      const item = document.createElement('div');
      item.className = `direct-message ${normalizeEmail(message.fromEmail) === normalizeEmail(current.email) ? 'self' : ''}`;
      const meta = document.createElement('small');
      const sender = findUserByEmail(message.fromEmail);
      meta.textContent = `${sender ? getPublicBankName(sender) : 'Bank'} • ${formatFullDate(message.timestamp)}`;
      const text = document.createElement('span');
      if (activeDirectMessageMode === 'money') {
        const details = [
          `${activeDirectMoneyDirection === 'sent' ? 'Money sent' : 'Money received'}: ${formatMoney(message.amount)}`
        ];
        if (activeDirectMoneyDirection === 'sent') details.push(`Transfer fee: ${formatMoney(message.fee || 0)}`);
        details.push(`Sender: ${message.senderName}`, `Receiver: ${message.receiverName}`);
        text.textContent = details.join('\n');
      } else {
        text.textContent = message.text;
      }
      item.append(meta, text);
      if (activeDirectMessageMode === 'money' && activeDirectMoneyDirection === 'received') {
        const transfer = transfers.find(entry => entry.id === message.transferId);
        const receipt = document.createElement('label');
        receipt.className = 'direct-message-receipt';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = Boolean(message.received || (transfer && transfer.received));
        checkbox.setAttribute('aria-label', `Mark transfer from ${sender ? getPublicBankName(sender) : 'another bank'} as received`);
        checkbox.addEventListener('change', () => {
          setDirectMessageReceived(message.id, message.transferId, checkbox.checked, user);
        });
        receipt.append(checkbox, document.createTextNode(checkbox.checked ? 'Received' : 'Mark as received'));
        item.appendChild(receipt);
      }
      list.appendChild(item);
    });
  }
  list.scrollTop = list.scrollHeight;
}

function openDirectMessages(user, initialMode = 'normal', initialMoneyDirection = 'sent') {
  if (!user) return;
  const current = getSession();
  const branchConnected = Boolean(current && isAcceptedBranchConnection(current.email, user.email));
  if (!canMessageBank(current, user)) {
    alert('You can message this bank after your branch connection is accepted.');
    return;
  }
  selectedBankEmail = normalizeEmail(user.email);
  activeDirectMessageMode = 'normal';
  activeDirectMoneyDirection = 'sent';
  if (current) markDirectMessagesAsRead(current);
  setActiveView('directChat');
  directMessagePanel.classList.remove('hidden');
  directMessagePanel.replaceChildren();
  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'profile-back';
  back.textContent = '← Back';
  back.addEventListener('click', () => {
    setActiveView('home');
    renderSearchedBankProfile(user);
  });
  const heading = document.createElement('h3');
  heading.textContent = `Messages with ${getPublicBankName(user)}`;
  const presence = createPresenceStatus(user);
  const headingWrap = document.createElement('div');
  headingWrap.className = 'direct-message-heading';
  headingWrap.append(heading, presence);
  const note = document.createElement('p');
  note.className = 'field-hint';
  note.textContent = 'Branch connection accepted. You can chat and send money to this bank.';
  const modes = document.createElement('nav');
  modes.className = 'direct-message-modes';
  modes.setAttribute('aria-label', 'Message type');
  const moneyMode = document.createElement('button');
  moneyMode.type = 'button';
  moneyMode.className = 'direct-message-mode';
  moneyMode.dataset.directMode = 'money';
  moneyMode.disabled = !branchConnected;
  moneyMode.title = branchConnected ? '' : 'Accept the branch invitation to enable money transfers.';
  moneyMode.textContent = branchConnected ? 'Money transfer' : 'Money transfer (branch connection required)';
  moneyMode.setAttribute('aria-pressed', 'false');
  const normalMode = document.createElement('button');
  normalMode.type = 'button';
  normalMode.className = 'direct-message-mode active';
  normalMode.dataset.directMode = 'normal';
  normalMode.textContent = 'Community chat';
  normalMode.setAttribute('aria-pressed', 'true');
  modes.append(moneyMode, normalMode);

  const moneyDirections = document.createElement('nav');
  moneyDirections.className = 'direct-message-directions hidden';
  moneyDirections.setAttribute('aria-label', 'Money transfer direction');
  const sentMoneyMode = document.createElement('button');
  sentMoneyMode.type = 'button';
  sentMoneyMode.className = 'direct-message-mode active';
  sentMoneyMode.dataset.moneyDirection = 'sent';
  sentMoneyMode.textContent = 'Money sent';
  sentMoneyMode.setAttribute('aria-pressed', 'true');
  const receivedMoneyMode = document.createElement('button');
  receivedMoneyMode.type = 'button';
  receivedMoneyMode.className = 'direct-message-mode';
  receivedMoneyMode.dataset.moneyDirection = 'received';
  receivedMoneyMode.textContent = 'Money received';
  receivedMoneyMode.setAttribute('aria-pressed', 'false');
  moneyDirections.append(sentMoneyMode, receivedMoneyMode);

  const list = document.createElement('div');
  list.className = 'direct-message-list';
  const normalForm = document.createElement('form');
  normalForm.className = 'direct-message-form direct-message-compose';
  const normalInput = document.createElement('input');
  normalInput.type = 'text';
  normalInput.maxLength = 1000;
  normalInput.placeholder = 'Write a message...';
  normalInput.setAttribute('aria-label', 'Write a direct message');
  normalInput.required = true;
  const normalSend = document.createElement('button');
  normalSend.type = 'submit';
  normalSend.textContent = 'Send message';
  normalForm.append(normalInput, normalSend);
  normalForm.addEventListener('submit', event => {
    event.preventDefault();
    const current = getSession();
    const text = normalInput.value.trim();
    if (!current || !text) return;
    if (!canMessageBank(current, user)) {
      alert('You can message this bank after your branch connection is accepted.');
      return;
    }
    const messages = getDirectMessages();
    messages.push({
      id: makeId(),
      fromEmail: current.email,
      toEmail: user.email,
      type: 'text',
      text,
      timestamp: Date.now(),
      read: false
    });
    try {
      saveDirectMessages(messages);
      normalInput.value = '';
      renderDirectMessages(user);
      renderMessageBadge();
    } catch {
      alert('Your message could not be saved. Browser storage may be full.');
    }
  });

  const moneyForm = document.createElement('form');
  moneyForm.className = 'direct-message-compose hidden';
  const senderField = document.createElement('div');
  senderField.className = 'field';
  const senderLabel = document.createElement('label');
  senderLabel.textContent = "Sender's name";
  const senderInput = document.createElement('textarea');
  senderInput.maxLength = 100;
  senderInput.placeholder = "Enter the sender's full name";
  senderInput.required = true;
  senderField.append(senderLabel, senderInput);
  const receiverField = document.createElement('div');
  receiverField.className = 'field';
  const receiverLabel = document.createElement('label');
  receiverLabel.textContent = "Receiver's name";
  const receiverInput = document.createElement('textarea');
  receiverInput.maxLength = 100;
  receiverInput.placeholder = "Enter the receiver's full name";
  receiverInput.required = true;
  receiverField.append(receiverLabel, receiverInput);
  const amountField = document.createElement('div');
  amountField.className = 'field';
  const amountLabel = document.createElement('label');
  amountLabel.textContent = 'Amount in SSP';
  const amountInput = document.createElement('input');
  amountInput.type = 'number';
  amountInput.min = '0.01';
  amountInput.step = '0.01';
  amountInput.placeholder = 'Enter amount (SSP)';
  amountInput.required = true;
  amountField.append(amountLabel, amountInput);
  const feeField = document.createElement('div');
  feeField.className = 'field';
  const feeLabel = document.createElement('label');
  feeLabel.textContent = 'Transfer fee (SSP)';
  const feeInput = document.createElement('input');
  feeInput.type = 'number';
  feeInput.min = '0';
  feeInput.step = '0.01';
  feeInput.value = '0';
  feeInput.placeholder = 'Enter transfer fee (SSP)';
  feeInput.required = true;
  feeField.append(feeLabel, feeInput);
  const amountPreview = document.createElement('output');
  amountPreview.className = 'calculated-amount';
  amountPreview.textContent = formatMoney(0);
  const feePreview = document.createElement('output');
  feePreview.className = 'calculated-amount';
  feePreview.textContent = `Transfer fee: ${formatMoney(0)}`;
  amountInput.addEventListener('input', () => {
    const amount = Number(amountInput.value);
    amountPreview.textContent = Number.isFinite(amount) && amount > 0 ? formatMoney(amount) : formatMoney(0);
  });
  feeInput.addEventListener('input', () => {
    const fee = Number(feeInput.value);
    feePreview.textContent = `Transfer fee: ${Number.isFinite(fee) && fee >= 0 ? formatMoney(fee) : formatMoney(0)}`;
  });
  const moneySend = document.createElement('button');
  moneySend.type = 'submit';
  moneySend.className = 'transfer-submit';
  moneySend.textContent = 'Send money';
  moneyForm.append(senderField, receiverField, amountField, feeField, amountPreview, feePreview, moneySend);
  moneyForm.addEventListener('submit', event => {
    event.preventDefault();
    const current = getSession();
    const senderName = senderInput.value.trim();
    const receiverName = receiverInput.value.trim();
    const amount = Number(amountInput.value);
    const fee = Number(feeInput.value);
    if (!current || !isAcceptedBranchConnection(current.email, user.email)) {
      alert('Accept the branch invitation before sending money to this bank.');
      return;
    }
    if (!senderName || !receiverName || !Number.isFinite(amount) || amount <= 0 ||
        !Number.isFinite(fee) || fee < 0) {
      alert('Enter both names, an amount greater than zero SSP, and a valid non-negative SSP transfer fee.');
      return;
    }

    const timestamp = Date.now();
    const transfers = getTransfers();
    const transferId = makeId();
    const transferEntry = {
      id: transferId,
      direction: 'sent',
      senderName,
      receiverName,
      senderBank: current.bankName || 'Bank name not provided',
      receiverBank: getPublicBankName(user),
      amount,
      fee,
      memo: `Sent to ${getPublicBankName(user)} through direct messages`,
      timestamp,
      received: false,
      recordedBy: current.email
    };
    transfers.push(transferEntry);
    const messages = getDirectMessages();
    messages.push({
      id: makeId(),
      transferId,
      fromEmail: current.email,
      toEmail: user.email,
      type: 'money',
      senderName,
      receiverName,
      amount,
      fee,
      timestamp,
      read: false
    });
    const transferNotifications = getTransferNotifications();
    transferNotifications.push(
      {
        id: makeId(),
        userEmail: current.email,
        otherBankEmail: user.email,
        transferId,
        direction: 'sent',
        bankName: current.bankName || 'Your bank',
        title: 'Money sent',
        message: `You sent ${formatMoney(amount)} to ${getPublicBankName(user)}.`,
        timestamp,
        amount
      },
      {
        id: makeId(),
        userEmail: user.email,
        otherBankEmail: current.email,
        transferId,
        direction: 'received',
        bankName: current.bankName || senderName,
        title: 'Money received',
        message: `${current.bankName || senderName} sent ${formatMoney(amount)} to your bank.`,
        timestamp,
        amount
      }
    );
    const oldTransfers = localStorage.getItem(STORAGE_TRANSFERS);
    try {
      saveTransfers(transfers);
      saveDirectMessages(messages);
      saveTransferNotifications(transferNotifications);
      moneyForm.reset();
      amountPreview.textContent = formatMoney(0);
      renderTransfers();
      renderDirectMessages(user);
      renderUpdates();
      renderNotificationBadge();
      renderMessageBadge();
    } catch {
      if (oldTransfers === null) localStorage.removeItem(STORAGE_TRANSFERS);
      else localStorage.setItem(STORAGE_TRANSFERS, oldTransfers);
      alert('The transfer could not be saved. Browser storage may be full.');
    }
  });

  const setMode = mode => {
    const isMoney = mode === 'money';
    activeDirectMessageMode = isMoney ? 'money' : 'normal';
    if (isMoney) activeDirectMoneyDirection = 'sent';
    moneyForm.classList.toggle('hidden', !isMoney);
    normalForm.classList.toggle('hidden', isMoney);
    moneyDirections.classList.toggle('hidden', !isMoney);
    moneyMode.classList.toggle('active', isMoney);
    normalMode.classList.toggle('active', !isMoney);
    moneyMode.setAttribute('aria-pressed', String(isMoney));
    normalMode.setAttribute('aria-pressed', String(!isMoney));
    sentMoneyMode.classList.toggle('active', activeDirectMoneyDirection === 'sent');
    receivedMoneyMode.classList.toggle('active', activeDirectMoneyDirection === 'received');
    sentMoneyMode.setAttribute('aria-pressed', String(activeDirectMoneyDirection === 'sent'));
    receivedMoneyMode.setAttribute('aria-pressed', String(activeDirectMoneyDirection === 'received'));
    renderDirectMessages(user);
  };
  const setMoneyDirection = direction => {
    activeDirectMoneyDirection = direction;
    sentMoneyMode.classList.toggle('active', direction === 'sent');
    receivedMoneyMode.classList.toggle('active', direction === 'received');
    sentMoneyMode.setAttribute('aria-pressed', String(direction === 'sent'));
    receivedMoneyMode.setAttribute('aria-pressed', String(direction === 'received'));
    renderDirectMessages(user);
  };
  moneyMode.addEventListener('click', () => setMode('money'));
  normalMode.addEventListener('click', () => setMode('normal'));
  sentMoneyMode.addEventListener('click', () => setMoneyDirection('sent'));
  receivedMoneyMode.addEventListener('click', () => setMoneyDirection('received'));

  directMessagePanel.append(back, headingWrap, note, modes, moneyDirections, list, moneyForm, normalForm);
  if (initialMode === 'money' && branchConnected) {
    setMode('money');
    setMoneyDirection(initialMoneyDirection === 'received' ? 'received' : 'sent');
  } else {
    renderDirectMessages(user);
  }
}

function renderUsers() {
  const users = getUsers();
  const current = getSession();

  userList.innerHTML = '';

  users.forEach(user => {
    const item = document.createElement('div');
    item.className = 'user-item';
    const avatar = user.bankLogo ? document.createElement('img') : document.createElement('span');
    avatar.className = 'avatar';
    if (user.bankLogo) {
      avatar.src = user.bankLogo;
      avatar.alt = `${getPublicBankName(user)} logo`;
    } else {
      avatar.textContent = getPublicBankName(user).charAt(0).toUpperCase();
      avatar.setAttribute('aria-hidden', 'true');
    }
    const details = document.createElement('span');
    details.className = 'user-details';
    const bankName = document.createElement('strong');
    bankName.textContent = getPublicBankName(user);
    details.appendChild(bankName);
    const status = document.createElement('span');
    status.className = 'status';
    item.append(avatar, details, status);
    if (current && current.email === user.email) {
      item.style.borderColor = 'rgba(76, 201, 240, 0.45)';
    }
    userList.appendChild(item);
  });
}

function renderMessages() {
  const user = getSession();
  if (!user) return;

  const messages = getMessages();
  messageList.innerHTML = '';

  messages.forEach(msg => {
    const isMine = msg.author === user.name || msg.author === getPublicBankName(user);
    const wrapper = document.createElement('div');
    wrapper.className = `message ${isMine ? 'self' : ''}`;
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `${getPublicNameForLegacyRecord(msg.author)} • ${msg.time}`;
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = msg.text;
    wrapper.append(meta, bubble);
    messageList.appendChild(wrapper);
  });

  setTimeout(() => {
    messageList.scrollTop = messageList.scrollHeight;
  }, 0);
}

function makeEmptyState(text) {
  const empty = document.createElement('div');
  empty.className = 'empty-state';
  empty.textContent = text;
  return empty;
}

function toggleTransferReceived(id, isReceived) {
  const transfers = getTransfers();
  const transfer = transfers.find(item => item.id === id);
  if (!transfer) {
    alert('This transfer could not be found in the saved history.');
    return;
  }
  transfer.received = isReceived;
  try {
    saveTransfers(transfers);
    renderTransfers();
    renderActivityHistory();
  } catch {
    alert('The receipt status could not be saved. Your browser storage may be full.');
  }
}

function setDirectMessageReceived(messageId, transferId, isReceived, user) {
  const messages = getDirectMessages();
  const message = messages.find(item => item.id === messageId);
  if (!message) return;
  message.received = isReceived;
  const transfers = getTransfers();
  const transfer = transfers.find(item => item.id === transferId);
  if (transfer) transfer.received = isReceived;
  const oldMessages = localStorage.getItem(STORAGE_DIRECT_MESSAGES);
  const oldTransfers = localStorage.getItem(STORAGE_TRANSFERS);
  try {
    saveDirectMessages(messages);
    if (transfer) saveTransfers(transfers);
    if (transfer) {
      renderTransfers();
      renderActivityHistory();
    }
    renderDirectMessages(user);
  } catch {
    if (oldMessages === null) localStorage.removeItem(STORAGE_DIRECT_MESSAGES);
    else localStorage.setItem(STORAGE_DIRECT_MESSAGES, oldMessages);
    if (oldTransfers === null) localStorage.removeItem(STORAGE_TRANSFERS);
    else localStorage.setItem(STORAGE_TRANSFERS, oldTransfers);
    alert('The transfer receipt could not be saved. Browser storage may be full.');
  }
}

function makeActivityEntry(transfer, includeReceipt) {
  const entry = document.createElement('div');
  entry.className = 'activity-entry';
  const sender = document.createElement('strong');
  sender.textContent = transfer.senderName;
  const receiver = document.createElement('span');
  receiver.textContent = `↓ ${transfer.receiverName}`;
  const amount = document.createElement('em');
  amount.textContent = formatMoney(transfer.amount);
  const time = document.createElement('span');
  time.textContent = new Date(transfer.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  entry.append(sender, receiver, amount, time);
  if (includeReceipt) {
    const receipt = document.createElement('label');
    receipt.className = 'activity-receipt';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'received-checkbox';
    checkbox.checked = Boolean(transfer.received);
    checkbox.setAttribute('aria-label', `Mark transfer from ${transfer.senderName} to ${transfer.receiverName} as received`);
    checkbox.addEventListener('change', () => toggleTransferReceived(transfer.id, checkbox.checked));
    receipt.append(checkbox, document.createTextNode(transfer.received ? 'Received' : 'Pending'));
    entry.appendChild(receipt);
  }
  return entry;
}

function appendActivityTotal(container, label, amount, className) {
  const item = document.createElement('div');
  if (className) item.className = className;
  const title = document.createElement('span');
  title.textContent = label;
  const value = document.createElement('strong');
  value.textContent = formatMoney(amount);
  item.append(title, value);
  container.appendChild(item);
}

function renderActivityHistory() {
  activityHistoryContent.replaceChildren();
  const transfers = getTransfers().slice().sort((first, second) => second.timestamp - first.timestamp);
  if (!transfers.length) {
    activityHistoryContent.appendChild(makeEmptyState('No sending or receiving activity has been recorded yet.'));
    return;
  }

  const days = new Map();
  transfers.forEach(transfer => {
    const date = new Date(transfer.timestamp);
    const dateKey = Number.isNaN(date.getTime()) ? 'unknown-date' : getLocalDateKey(date);
    const recorder = transfer.recordedBy ? findUserByEmail(transfer.recordedBy) : null;
    const bankName = recorder
      ? getPublicBankName(recorder)
      : transfer.direction === 'received'
        ? transfer.receiverBank || 'Bank name not provided'
        : transfer.senderBank || 'Bank name not provided';
    if (!days.has(dateKey)) days.set(dateKey, new Map());
    const banks = days.get(dateKey);
    if (!banks.has(bankName)) banks.set(bankName, []);
    banks.get(bankName).push(transfer);
  });

  let overallSent = 0;
  let overallTransferred = 0;
  let overallReceived = 0;
  days.forEach(bankGroups => {
    bankGroups.forEach(bankTransfers => {
      overallSent += bankTransfers
        .filter(transfer => transfer.direction === 'sent')
        .reduce((sum, transfer) => sum + (Number(transfer.amount) || 0), 0);
      overallTransferred += bankTransfers.reduce((sum, transfer) => sum + (Number(transfer.amount) || 0), 0);
      overallReceived += bankTransfers
        .filter(transfer => transfer.received)
        .reduce((sum, transfer) => sum + (Number(transfer.amount) || 0), 0);
    });
  });

  days.forEach((bankGroups, dateKey) => {
    const day = document.createElement('section');
    day.className = 'activity-day';
    const dateHeading = document.createElement('h4');
    dateHeading.textContent = dateKey === 'unknown-date'
      ? 'Unknown date'
      : new Date(`${dateKey}T12:00:00`).toLocaleDateString([], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    day.appendChild(dateHeading);
    let daySent = 0;
    let dayTransferred = 0;
    let dayReceived = 0;

    bankGroups.forEach((bankTransfers, bankName) => {
      const bankSection = document.createElement('section');
      bankSection.className = 'activity-bank';
      const bankHeading = document.createElement('h5');
      bankHeading.className = 'activity-bank-heading';
      bankHeading.textContent = bankName;
      const columns = document.createElement('div');
      columns.className = 'activity-columns';

      const sentColumn = document.createElement('div');
      sentColumn.className = 'activity-column sent';
      const sentHeading = document.createElement('h5');
      sentHeading.textContent = 'Money sent';
      sentColumn.appendChild(sentHeading);

      const transfersColumn = document.createElement('div');
      transfersColumn.className = 'activity-column transfers';
      const transfersHeading = document.createElement('h5');
      transfersHeading.textContent = 'Transfers';
      transfersColumn.appendChild(transfersHeading);

      const receivedColumn = document.createElement('div');
      receivedColumn.className = 'activity-column received';
      const receivedHeading = document.createElement('h5');
      receivedHeading.textContent = 'Money received';
      receivedColumn.appendChild(receivedHeading);

      let bankSent = 0;
      let bankTransferred = 0;
      let bankReceived = 0;
      bankTransfers.forEach(transfer => {
        const amount = Number(transfer.amount) || 0;
        bankTransferred += amount;
        if (transfer.direction === 'sent') {
          bankSent += amount;
          sentColumn.appendChild(makeActivityEntry(transfer, false));
        }
        transfersColumn.appendChild(makeActivityEntry(transfer, true));
        if (transfer.direction === 'received' || transfer.received) {
          if (transfer.received) bankReceived += amount;
          receivedColumn.appendChild(makeActivityEntry(transfer, false));
        }
      });

      if (!bankSent) sentColumn.appendChild(makeEmptyState('No money sent.'));
      if (!bankReceived) receivedColumn.appendChild(makeEmptyState('No money confirmed as received.'));
      appendActivityTotal(sentColumn, 'Sent total', bankSent);
      appendActivityTotal(transfersColumn, 'Transfers total', bankTransferred, 'transfers');
      appendActivityTotal(receivedColumn, 'Received total', bankReceived);

      columns.append(sentColumn, transfersColumn, receivedColumn);
      bankSection.append(bankHeading, columns);
      day.appendChild(bankSection);
      daySent += bankSent;
      dayTransferred += bankTransferred;
      dayReceived += bankReceived;
    });

    const daySummary = document.createElement('div');
    daySummary.className = 'activity-summary';
    appendActivityTotal(daySummary, 'Day sent total', daySent);
    appendActivityTotal(daySummary, 'Day transfers total', dayTransferred, 'transfers');
    appendActivityTotal(daySummary, 'Day received total', dayReceived);
    day.appendChild(daySummary);
    activityHistoryContent.appendChild(day);
  });

  const overall = document.createElement('div');
  overall.className = 'activity-overall';
  appendActivityTotal(overall, 'Overall sent total', overallSent);
  appendActivityTotal(overall, 'Overall transfers total', overallTransferred, 'transfers');
  appendActivityTotal(overall, 'Overall received total', overallReceived);
  activityHistoryContent.appendChild(overall);
  const grandTotal = document.createElement('div');
  grandTotal.className = 'activity-grand-total';
  const grandLabel = document.createElement('span');
  grandLabel.textContent = 'Overall total sent + received:';
  const grandAmount = document.createElement('strong');
  grandAmount.textContent = formatMoney(overallSent + overallReceived);
  grandTotal.append(grandLabel, grandAmount);
  activityHistoryContent.appendChild(grandTotal);
}

function appendDetailField(list, label, value) {
  const item = document.createElement('div');
  const heading = document.createElement('strong');
  heading.textContent = label;
  const text = document.createElement('span');
  text.textContent = value || '—';
  item.append(heading, text);
  list.appendChild(item);
}

function openTransferDetails(transfer) {
  const content = document.createElement('div');
  content.className = 'detail-list';
  appendDetailField(content, 'Date, month and year', formatFullDate(transfer.timestamp));
  appendDetailField(content, "Sender's name", transfer.senderName);
  appendDetailField(content, "Receiver's name", transfer.receiverName);
  appendDetailField(content, 'Amount sent', formatMoney(transfer.amount));
  appendDetailField(content, 'Transfer fee', formatMoney(transfer.fee || 0));
  appendDetailField(content, 'Amount received', transfer.received ? formatMoney(transfer.amount) : 'Pending — not yet confirmed');
  appendDetailField(content, "Sender's bank", transfer.senderBank);
  appendDetailField(content, "Receiver's bank", transfer.receiverBank);
  appendDetailField(content, 'Transfer message / reference', transfer.memo);
  appendDetailField(content, 'Recorded as', transfer.direction === 'sent' ? 'Sent by this bank' : 'Received by this bank');

  const status = document.createElement('label');
  status.className = 'detail-status';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'received-checkbox';
  checkbox.checked = Boolean(transfer.received);
  checkbox.setAttribute('aria-label', 'Mark this transfer as received');
  checkbox.addEventListener('change', () => {
    toggleTransferReceived(transfer.id, checkbox.checked);
    transferDetailDialog.close();
  });
  status.append(checkbox, document.createTextNode(' Receiver has received the money'));
  content.appendChild(status);
  transferDetailContent.replaceChildren(content);
  transferDetailDialog.showModal();
}

function renderTransferTable(container, transfers) {
  container.innerHTML = '';
  if (!transfers.length) {
    container.appendChild(makeEmptyState('No transfers match this history.'));
    return;
  }

  const ordered = transfers.slice().sort((a, b) => b.timestamp - a.timestamp);
  const groups = new Map();
  ordered.forEach(transfer => {
    const date = new Date(transfer.timestamp);
    const dateKey = Number.isNaN(date.getTime()) ? 'unknown-date' : getLocalDateKey(date);
    if (!groups.has(dateKey)) groups.set(dateKey, []);
    groups.get(dateKey).push(transfer);
  });

  const wrap = document.createElement('div');
  wrap.className = 'ledger-table-wrap';
  const table = document.createElement('table');
  table.className = 'ledger-table';
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  ['Date', 'Sender / Receiver', 'Banks', 'Amount sent', 'Transfer fee', 'Amount received', 'Received?'].forEach(label => {
    const th = document.createElement('th');
    th.textContent = label;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  const tbody = document.createElement('tbody');

  groups.forEach((dayTransfers, dateKey) => {
    const day = document.createElement('tr');
    day.className = 'day-total-row';
    const dayCell = document.createElement('td');
    dayCell.colSpan = 7;
    dayCell.textContent = dateKey === 'unknown-date'
      ? 'Unknown date'
      : new Date(`${dateKey}T12:00:00`).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
    day.appendChild(dayCell);
    tbody.appendChild(day);

    let sentTotal = 0;
    let receivedTotal = 0;
    dayTransfers.forEach(transfer => {
      const row = document.createElement('tr');
      row.className = 'ledger-row';
      row.tabIndex = 0;
      row.setAttribute('role', 'button');
      row.setAttribute('aria-label', `Transfer from ${transfer.senderName} to ${transfer.receiverName}, ${formatMoney(transfer.amount)}`);
      row.addEventListener('click', () => openTransferDetails(transfer));
      row.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openTransferDetails(transfer);
        }
      });

      const dateCell = document.createElement('td');
      dateCell.textContent = new Date(transfer.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const namesCell = document.createElement('td');
      namesCell.className = 'ledger-name-cell';
      const sender = document.createElement('strong');
      sender.textContent = transfer.senderName;
      const receiver = document.createElement('span');
      receiver.textContent = `↓ ${transfer.receiverName}`;
      namesCell.append(sender, receiver);
      const banksCell = document.createElement('td');
      banksCell.className = 'ledger-name-cell';
      const senderBank = document.createElement('strong');
      senderBank.textContent = transfer.senderBank;
      const receiverBank = document.createElement('span');
      receiverBank.textContent = `↓ ${transfer.receiverBank}`;
      banksCell.append(senderBank, receiverBank);
      const sentCell = document.createElement('td');
      sentCell.textContent = formatMoney(transfer.amount);
      const feeCell = document.createElement('td');
      feeCell.textContent = formatMoney(transfer.fee || 0);
      const receivedCell = document.createElement('td');
      receivedCell.textContent = transfer.received ? formatMoney(transfer.amount) : 'Pending';
      const statusCell = document.createElement('td');
      const receivedCheckbox = document.createElement('input');
      receivedCheckbox.type = 'checkbox';
      receivedCheckbox.className = 'received-checkbox';
      receivedCheckbox.checked = Boolean(transfer.received);
      receivedCheckbox.setAttribute('aria-label', `Mark transfer from ${transfer.senderName} to ${transfer.receiverName} as received`);
      receivedCheckbox.addEventListener('click', event => event.stopPropagation());
      receivedCheckbox.addEventListener('change', () => toggleTransferReceived(transfer.id, receivedCheckbox.checked));
      statusCell.appendChild(receivedCheckbox);
      row.append(dateCell, namesCell, banksCell, sentCell, feeCell, receivedCell, statusCell);
      tbody.appendChild(row);

      if (transfer.direction === 'sent') sentTotal += Number(transfer.amount) || 0;
      if (transfer.received) receivedTotal += Number(transfer.amount) || 0;
    });

    const totalRow = document.createElement('tr');
    totalRow.className = 'day-total-row';
    const totalLabel = document.createElement('td');
    totalLabel.colSpan = 3;
    totalLabel.textContent = 'Daily totals';
    const totalSentCell = document.createElement('td');
    totalSentCell.textContent = formatMoney(sentTotal);
    const totalFeesCell = document.createElement('td');
    totalFeesCell.textContent = formatMoney(dayTransfers.reduce((sum, transfer) => sum + (Number(transfer.fee) || 0), 0));
    const totalReceivedCell = document.createElement('td');
    totalReceivedCell.textContent = formatMoney(receivedTotal);
    const totalBlank = document.createElement('td');
    totalRow.append(totalLabel, totalSentCell, totalFeesCell, totalReceivedCell, totalBlank);
    tbody.appendChild(totalRow);
  });

  table.append(thead, tbody);
  wrap.appendChild(table);
  container.appendChild(wrap);
}

function renderTransfers() {
  const transfers = getTransfers();
  const todayKey = getLocalDateKey(new Date());
  const todayTransfers = transfers.filter(item => getLocalDateKey(new Date(item.timestamp)) === todayKey);
  const sentToday = todayTransfers
    .filter(item => item.direction === 'sent')
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const receivedToday = todayTransfers
    .filter(item => item.received)
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  document.getElementById('todaySentTotal').textContent = formatMoney(sentToday);
  document.getElementById('todayReceivedTotal').textContent = formatMoney(receivedToday);

  const search = historySearch.value.trim().toLocaleLowerCase();
  const filtered = transfers.filter(transfer => {
    if (transfer.direction !== activeHistoryFilter) return false;
    if (!search) return true;
    const searchable = [
      transfer.senderName, transfer.receiverName, transfer.senderBank,
      transfer.receiverBank, transfer.memo, formatFullDate(transfer.timestamp)
    ].join(' ').toLocaleLowerCase();
    return searchable.includes(search);
  });
  renderTransferTable(historyTableContainer, filtered);
  renderTransferTable(recentTransferList, transfers.slice().sort((a, b) => b.timestamp - a.timestamp).slice(0, 5));
}

function renderBankProfile() {
  const profile = getBankProfile();
  const currentUser = getSession();
  const bankName = profile.name;
  const todayKey = getLocalDateKey(new Date());
  const counts = getCustomerCounts();
  const count = Number.isInteger(Number(counts[todayKey])) && Number(counts[todayKey]) >= 0
    ? Number(counts[todayKey])
    : 0;
  document.getElementById('bankProfileHeading').textContent = bankName;
  bankNameInput.value = bankName;
  bankLocationInput.value = profile.location || (currentUser && currentUser.bankLocation) || '';
  bankPhoneInput.value = profile.phone || (currentUser && currentUser.bankPhone) || '';
  bankWebsiteInput.value = profile.website || (currentUser && currentUser.bankWebsite) || '';
  bankAddressInput.value = profile.address || (currentUser && currentUser.bankAddress) || '';
  bankAboutInput.value = profile.about || (currentUser && currentUser.bankAbout) || '';
  dailyCustomersInput.value = String(count);
  document.getElementById('customerCountText').textContent =
    `${count} customer${count === 1 ? '' : 's'} served today • ${new Date().toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}`;
}

function renderAccountManagement() {
  accountManagementList.replaceChildren();
  deletedAccountManagementList.replaceChildren();
  const currentUser = getSession();
  getUsers().forEach(user => {
    const row = document.createElement('div');
    row.className = 'account-setting-row';
    const details = document.createElement('div');
    details.className = 'account-setting-details';
    const bankName = document.createElement('strong');
    bankName.textContent = getPublicBankName(user);
    const state = document.createElement('small');
    state.textContent = user.blocked === true ? `${user.email} • Blocked` : `${user.email} • Open`;
    details.append(bankName, state);
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = user.blocked === true ? 'Unblock' : 'Block';
    const isCurrentUser = currentUser && normalizeEmail(currentUser.email) === normalizeEmail(user.email);
    button.disabled = Boolean(isCurrentUser);
    button.setAttribute('aria-label', `${user.blocked === true ? 'Unblock' : 'Block'} ${getPublicBankName(user)} account`);
    button.addEventListener('click', () => {
      const actingUser = getSession();
      if (!actingUser || normalizeEmail(actingUser.email) !== OWNER_EMAIL || isCurrentUser) return;
      const users = getUsers();
      const target = users.find(account => normalizeEmail(account.email) === normalizeEmail(user.email));
      if (!target) return;
      target.blocked = target.blocked !== true;
      try {
        saveUsers(users);
        renderAccountManagement();
      } catch {
        alert('The account status could not be saved. Browser storage may be full.');
      }
    });
    row.append(details, button);
    accountManagementList.appendChild(row);
  });

  getDeletedUsers().forEach(user => {
    const row = document.createElement('div');
    row.className = 'account-setting-row';
    const details = document.createElement('div');
    details.className = 'account-setting-details';
    const bankName = document.createElement('strong');
    bankName.textContent = getPublicBankName(user);
    const state = document.createElement('small');
    state.textContent = `${user.email} • Deleted`;
    details.append(bankName, state);
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Recover';
    button.setAttribute('aria-label', `Recover ${getPublicBankName(user)} account`);
    button.addEventListener('click', () => restoreDeletedAccount(user.email));
    row.append(details, button);
    deletedAccountManagementList.appendChild(row);
  });

  if (!deletedAccountManagementList.childElementCount) {
    const emptyState = document.createElement('p');
    emptyState.className = 'field-hint';
    emptyState.textContent = 'No deleted accounts.';
    deletedAccountManagementList.appendChild(emptyState);
  }
}

function restoreDeletedAccount(email) {
  const currentUser = getSession();
  if (!currentUser || normalizeEmail(currentUser.email) !== OWNER_EMAIL) return;
  const normalizedEmail = normalizeEmail(email);
  const deletedUsers = getDeletedUsers();
  const deletedUser = deletedUsers.find(user => normalizeEmail(user.email) === normalizedEmail);
  if (!deletedUser) return;

  const users = getUsers();
  if (users.some(user => normalizeEmail(user.email) === normalizedEmail)) {
    alert('An active account already uses this email address.');
    return;
  }

  const restoredUser = { ...deletedUser };
  delete restoredUser.deletedAt;
  users.push(restoredUser);
  try {
    saveUsers(users);
    saveDeletedUsers(deletedUsers.filter(user => normalizeEmail(user.email) !== normalizedEmail));
    renderAccountManagement();
  } catch {
    alert('The account could not be recovered. Browser storage may be full.');
  }
}

function renderSettings() {
  const currentUser = getSession();
  if (!currentUser) return;
  const profile = getBankProfile();
  const nameParts = String(currentUser.name || '').trim().split(/\s+/);
  settingsFirstNameInput.value = nameParts.shift() || '';
  settingsSecondNameInput.value = nameParts.join(' ');
  settingsBankNameInput.value = currentUser.bankName || profile.name;
  settingsBankLocationInput.value = currentUser.bankLocation || profile.location || '';
  settingsBankPhoneInput.value = currentUser.bankPhone || profile.phone || '';
  settingsBankAddressInput.value = currentUser.bankAddress || profile.address || '';
  settingsBankWebsiteInput.value = currentUser.bankWebsite || profile.website || '';
  settingsBankAboutInput.value = currentUser.bankAbout || profile.about || '';
  if (currentUser.bankLogo) {
    settingsLogoPreview.src = currentUser.bankLogo;
    settingsLogoPreview.classList.remove('hidden');
  } else {
    settingsLogoPreview.removeAttribute('src');
    settingsLogoPreview.classList.add('hidden');
  }
  const isOwner = normalizeEmail(currentUser.email) === OWNER_EMAIL;
  adminSettingsPanel.classList.toggle('hidden', !isOwner);
  if (isOwner) {
    registrationOpenToggle.checked = isRegistrationOpen();
    renderAccountManagement();
  }
}

function renderPostFeed(container, fallbackText) {
  if (!container) return;
  container.innerHTML = '';
  const posts = getTimelinePosts().slice().reverse();
  if (!posts.length) {
    container.appendChild(makeEmptyState(fallbackText));
    return;
  }

  posts.forEach(post => {
    const card = document.createElement('article');
    card.className = 'post-card';
    const author = findTimelinePostAuthor(post);
    const authorLogoSource = (author && author.bankLogo) || post.bankLogo || '';
    const authorHeading = document.createElement('h3');
    authorHeading.className = 'post-bank-name';
    const authorLogo = authorLogoSource ? document.createElement('img') : document.createElement('span');
    authorLogo.className = 'post-author-logo';
    if (authorLogoSource) {
      authorLogo.src = authorLogoSource;
      authorLogo.alt = '';
    } else {
      authorLogo.textContent = post.bankName.charAt(0).toUpperCase();
      authorLogo.setAttribute('aria-hidden', 'true');
    }
    authorHeading.appendChild(createBankAuthorControl(author, post.bankName, authorLogo));
    const postText = document.createElement('p');
    postText.textContent = post.text;
    const meta = document.createElement('span');
    meta.className = 'update-meta';
    const postCustomerCount = Number(post.customerCount);
    const customerText = Number.isInteger(postCustomerCount)
      ? `${postCustomerCount} customer${postCustomerCount === 1 ? '' : 's'} served`
      : 'Customer count not recorded';
    meta.textContent = `${formatFullDate(post.timestamp)} • ${customerText}`;
    card.appendChild(authorHeading);
    if (post.text) card.appendChild(postText);
    if (post.image) {
      const image = document.createElement('img');
      image.src = post.image;
      image.alt = `Picture shared by ${post.bankName}`;
      card.appendChild(image);
      const downloadLink = document.createElement('a');
      downloadLink.className = 'post-image-download';
      downloadLink.href = post.image;
      downloadLink.download = `${post.bankName.replace(/[^\w-]+/g, '-') || 'bank'}-photo.${post.image.match(/^data:image\/(jpeg|png|gif|webp);/i)?.[1]?.replace('jpeg', 'jpg') || 'png'}`;
      downloadLink.textContent = 'Download picture';
      card.appendChild(downloadLink);
    }
    card.appendChild(meta);

    const actions = document.createElement('div');
    actions.className = 'post-actions';
    const reactions = post.reactions && typeof post.reactions === 'object' ? post.reactions : {};
    const currentUser = getSession();
    ['👍', '❤️', '😂', '🎉', '😮'].forEach(emoji => {
      const users = Array.isArray(reactions[emoji]) ? reactions[emoji] : [];
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `reaction-button ${currentUser && users.some(email => normalizeEmail(email) === normalizeEmail(currentUser.email)) ? 'selected' : ''}`;
      button.textContent = `${emoji} ${users.length}`;
      button.setAttribute('aria-label', `${users.length} reactions: ${emoji}`);
      button.addEventListener('click', () => {
        if (!currentUser) return;
        const updatedPosts = getTimelinePosts();
        const savedPost = updatedPosts.find(item => item.id === post.id);
        if (!savedPost) {
          alert('This post could not be found.');
          return;
        }
        if (!savedPost.reactions || typeof savedPost.reactions !== 'object') savedPost.reactions = {};
        const usersForEmoji = Array.isArray(savedPost.reactions[emoji]) ? savedPost.reactions[emoji] : [];
        const alreadyReacted = usersForEmoji.some(email => normalizeEmail(email) === normalizeEmail(currentUser.email));
        savedPost.reactions[emoji] = alreadyReacted
          ? usersForEmoji.filter(email => normalizeEmail(email) !== normalizeEmail(currentUser.email))
          : [...usersForEmoji, currentUser.email];
        try {
          saveTimelinePosts(updatedPosts);
          renderTimeline();
          renderHomeFeed();
        } catch {
          alert('Your reaction could not be saved. Browser storage may be full.');
        }
      });
      actions.appendChild(button);
    });
    const shareButton = document.createElement('button');
    shareButton.type = 'button';
    shareButton.className = 'reaction-button';
    shareButton.textContent = 'Share';
    shareButton.addEventListener('click', () => {
      currentSharePost = post;
      sharePostDialog.showModal();
    });
    actions.appendChild(shareButton);
    card.appendChild(actions);

    const reactionPeople = document.createElement('div');
    reactionPeople.className = 'reaction-people';
    Object.entries(reactions).forEach(([emoji, reactorEmails]) => {
      if (!Array.isArray(reactorEmails)) return;
      const reactors = [...new Set(reactorEmails.map(normalizeEmail))]
        .map(findUserByEmail)
        .filter(Boolean);
      if (!reactors.length) return;

      const group = document.createElement('div');
      group.className = 'reaction-people-group';
      const marker = document.createElement('span');
      marker.textContent = emoji;
      marker.setAttribute('aria-label', `${reactors.length} ${emoji} reactions`);
      group.appendChild(marker);
      reactors.forEach((reactor, index) => {
        if (index) group.appendChild(document.createTextNode(', '));
        const avatar = reactor.bankLogo ? document.createElement('img') : document.createElement('span');
        avatar.className = 'reaction-person-avatar';
        if (reactor.bankLogo) {
          avatar.src = reactor.bankLogo;
          avatar.alt = '';
        } else {
          avatar.classList.add('reaction-person-initial');
          avatar.textContent = getPublicBankName(reactor).charAt(0).toUpperCase();
          avatar.setAttribute('aria-hidden', 'true');
        }
        group.appendChild(createBankAuthorControl(
          reactor,
          getPublicBankName(reactor),
          avatar,
          { includeBranchAction: true }
        ));
      });
      reactionPeople.appendChild(group);
    });
    if (reactionPeople.childElementCount) card.appendChild(reactionPeople);

    const commentList = document.createElement('div');
    commentList.className = 'comment-list';
    (Array.isArray(post.comments) ? post.comments : []).forEach(comment => {
      const commentItem = document.createElement('div');
      commentItem.className = 'post-comment';
      const commentAuthor = findUserByCommentAuthor(comment.author);
      if (commentAuthor) {
        commentItem.append(
          createBankAuthorControl(commentAuthor, getPublicBankName(commentAuthor)),
          document.createTextNode(': ')
        );
      } else {
        const author = document.createElement('strong');
        author.textContent = `${getPublicNameForLegacyRecord(comment.author)}: `;
        commentItem.appendChild(author);
      }
      commentItem.appendChild(document.createTextNode(comment.text));
      commentList.appendChild(commentItem);
    });
    card.appendChild(commentList);

    const commentForm = document.createElement('form');
    commentForm.className = 'comment-form';
    const commentInput = document.createElement('input');
    commentInput.type = 'text';
    commentInput.maxLength = 500;
    commentInput.placeholder = 'Write a comment...';
    commentInput.required = true;
    commentInput.setAttribute('aria-label', 'Write a comment');
    const commentButton = document.createElement('button');
    commentButton.type = 'submit';
    commentButton.textContent = 'Comment';
    commentForm.append(commentInput, commentButton);
    commentForm.addEventListener('submit', event => {
      event.preventDefault();
      const user = getSession();
      const text = commentInput.value.trim();
      if (!user || !text) return;
      const updatedPosts = getTimelinePosts();
      const savedPost = updatedPosts.find(item => item.id === post.id);
      if (!savedPost) {
        alert('This post could not be found.');
        return;
      }
      if (!Array.isArray(savedPost.comments)) savedPost.comments = [];
      savedPost.comments.push({ author: getPublicBankName(user), text, timestamp: Date.now() });
      try {
        saveTimelinePosts(updatedPosts);
        renderTimeline();
        renderHomeFeed();
      } catch {
        alert('Your comment could not be saved. Browser storage may be full.');
      }
    });
    card.appendChild(commentForm);
    container.appendChild(card);
  });
}

function renderTimeline() {
  renderPostFeed(timelinePosts, 'No bank posts yet. Share the first update.');
}

function renderHomeFeed() {
  renderPostFeed(homeFeedPosts, 'No branch posts yet. Be the first to share an update.');
}

async function copyPostText(text) {
  if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
    alert('Copying is not supported in this browser. You can still share the post text manually.');
    return false;
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    alert('Post text could not be copied. You can still share it manually.');
    return false;
  }
}

async function shareTimelinePost(post, platform) {
  const text = `${post.bankName}${post.text ? `\n${post.text}` : ' shared a photo.'}`;
  const encodedText = encodeURIComponent(text);
  const publicPageUrl = /^https?:$/.test(window.location.protocol) ? window.location.href : '';

  if (platform === 'x') {
    window.open(`https://x.com/intent/post?text=${encodedText}`, '_blank', 'noopener,noreferrer');
    return;
  }
  if (platform === 'whatsapp') {
    window.open(`https://wa.me/?text=${encodedText}`, '_blank', 'noopener,noreferrer');
    return;
  }
  if (platform === 'facebook') {
    if (publicPageUrl) {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicPageUrl)}&quote=${encodedText}`,
        '_blank',
        'noopener,noreferrer'
      );
    } else {
      window.open('https://www.facebook.com/', '_blank', 'noopener,noreferrer');
      await copyPostText(text);
      alert('The post text is copied when supported. Paste it into Facebook; download the photo from the post to attach it.');
    }
    return;
  }
  if (platform !== 'instagram') return;

  if (post.image && typeof navigator.share === 'function' && typeof navigator.canShare === 'function') {
    try {
      const [metadata, encodedImage] = post.image.split(',');
      const mimeType = metadata.match(/^data:(image\/[^;]+)/i)?.[1];
      if (!mimeType || !encodedImage) throw new Error('The picture data is invalid.');
      const binary = atob(encodedImage);
      const bytes = new Uint8Array(binary.length);
      for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
      const extension = mimeType.split('/')[1].replace('jpeg', 'jpg');
      const filename = `${post.bankName.replace(/[^\w-]+/g, '-') || 'bank'}-photo.${extension}`;
      const file = new File([bytes], filename, { type: mimeType });
      const shareData = { title: post.bankName, text: post.text || '', files: [file] };
      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return;
      }
    } catch (error) {
      if (error.name === 'AbortError') return;
    }
  }

  window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
  await copyPostText(text);
  alert('Instagram does not provide a web link for pre-filled posts. Paste the copied caption there and use Download picture on the post to attach its photo.');
}

function setActiveMessageSection(sectionName) {
  const sections = {
    transfer: document.getElementById('transferSection'),
    history: document.getElementById('historySection'),
    chat: document.getElementById('communityMessages')
  };
  if (!sections[sectionName]) return;
  Object.entries(sections).forEach(([name, section]) => {
    section.classList.toggle('hidden', name !== sectionName);
  });
  messageForm.classList.toggle('hidden', sectionName !== 'chat');
  document.querySelectorAll('.section-tab').forEach(button => {
    button.classList.toggle('active', button.dataset.messageSection === sectionName);
  });
  if (sectionName === 'history') renderTransfers();
  if (sectionName === 'chat') renderMessages();
}

function createUpdateCard(update) {
  const card = document.createElement('article');
  card.className = 'update-item';
  const title = document.createElement('h3');
  title.textContent = update.title;
  const text = document.createElement('p');
  text.textContent = update.text;
  const meta = document.createElement('span');
  meta.className = 'update-meta';
  meta.textContent = `Posted by ${getPublicNameForLegacyRecord(update.author)} • ${update.time}`;
  card.append(title, text, meta);
  return card;
}

function createTransferNotificationCard(notification) {
  const card = document.createElement('article');
  card.className = 'update-card';
  const title = document.createElement('h3');
  title.textContent = notification.title || 'Bank notification';
  const text = document.createElement('p');
  text.textContent = notification.message || 'A bank has sent money.';
  const meta = document.createElement('span');
  meta.className = 'update-meta';
  const senderName = notification.bankName || 'Bank';
  meta.textContent = `${senderName} • ${formatFullDate(notification.timestamp)}`;
  card.append(title, text, meta);
  const otherBank = notification.otherBankEmail ? findUserByEmail(notification.otherBankEmail) : null;
  if (otherBank) {
    const openTransfer = document.createElement('button');
    openTransfer.type = 'button';
    openTransfer.className = 'profile-action primary';
    const direction = notification.direction === 'received' ? 'received' : 'sent';
    openTransfer.textContent = direction === 'received' ? 'Open money received' : 'Open money sent';
    openTransfer.addEventListener('click', () => openDirectMessages(otherBank, 'money', direction));
    card.appendChild(openTransfer);
  }
  return card;
}

function renderUpdateList(container, updates) {
  container.innerHTML = '';
  if (!updates.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'There are no updates yet.';
    container.appendChild(empty);
    return;
  }
  updates.forEach(update => container.appendChild(createUpdateCard(update)));
}

function renderUpdates() {
  const updates = getUpdates().slice().reverse();
  renderUpdateList(homeUpdateList, updates.slice(0, 3));
  const user = getSession();
  const transferNotifications = user
    ? getTransferNotifications().filter(notification =>
      normalizeEmail(notification.userEmail) === normalizeEmail(user.email))
    : [];
  const entries = [
    ...updates.map(update => ({ timestamp: Number(update.timestamp) || 0, type: 'update', item: update })),
    ...transferNotifications.map(notification => ({ timestamp: Number(notification.timestamp) || 0, type: 'transfer', item: notification }))
  ].sort((first, second) => second.timestamp - first.timestamp);
  updateList.replaceChildren();
  if (!entries.length) {
    updateList.appendChild(makeEmptyState('There are no notifications yet.'));
    return;
  }
  entries.forEach(entry => {
    updateList.appendChild(entry.type === 'transfer'
      ? createTransferNotificationCard(entry.item)
      : createUpdateCard(entry.item));
  });
}

function setActiveView(viewName) {
  const views = {
    home: document.getElementById('homeView'),
    timeline: document.getElementById('timelineView'),
    notifications: document.getElementById('notificationsView'),
    branchInvitations: document.getElementById('branchInvitationsView'),
    messages: document.getElementById('messagesView'),
    settings: document.getElementById('settingsView'),
    directChat: document.getElementById('directChatView')
  };
  if (!views[viewName]) return;

  Object.entries(views).forEach(([name, element]) => {
    element.classList.toggle('hidden', name !== viewName);
  });
  document.querySelectorAll('.nav-button').forEach(button => {
    const isActive = button.dataset.view === viewName;
    button.classList.toggle('active', isActive);
    if (isActive) {
      button.setAttribute('aria-current', 'page');
    } else {
      button.removeAttribute('aria-current');
    }
  });

  if (viewName === 'notifications') {
    const user = getSession();
    renderBranchRequests(notificationBranchRequestList, true);
    renderUpdates();
    if (user) {
      markUpdatesAsRead(user);
      markTransferNotificationsAsRead(user);
    }
  }
  if (viewName === 'branchInvitations') renderBranchRequests(mainBranchInvitationList);
  if (viewName === 'messages') {
    const user = getSession();
    if (user) markDirectMessagesAsRead(user);
  }
  if (viewName === 'home') renderHomeFeed();
  if (viewName === 'timeline') {
    renderBankProfile();
    renderTimeline();
  }
  if (viewName === 'messages') renderMessages();
  if (viewName === 'settings') renderSettings();
}

function showChat(user) {
  touchUserPresence(user && user.email);
  authScreen.classList.remove('active');
  chatScreen.classList.add('active');
  appNav.classList.remove('hidden');
  bankSearchInput.value = '';
  bankSearchResults.replaceChildren();
  renderSearchedBankProfile(null);
  welcomeName.textContent = `Hi, ${user.name}`;
  welcomeText.textContent = 'You are now connected to the community.';
  updateForm.classList.toggle('hidden', user.email.toLowerCase() !== OWNER_EMAIL);
  renderUsers();
  renderUpdates();
  renderBranchRequests();
  renderTransfers();
  renderActivityHistory();
  renderTimeline();
  renderHomeFeed();
  renderNotificationBadge();
  renderMessageBadge();
  setActiveMessageSection('transfer');
  setActiveView('home');
}

function showAuth() {
  renderRegistrationAvailability();
  chatScreen.classList.remove('active');
  authScreen.classList.add('active');
  appNav.classList.add('hidden');
  welcomeName.textContent = 'Welcome';
  welcomeText.textContent = 'Join the conversation.';
  notificationBadge.classList.add('hidden');
  messageBadge.classList.add('hidden');
}

bankSearchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  renderBankSearchResults(bankSearchInput.value.trim());
});

bankSearchInput.addEventListener('input', function () {
  renderBankSearchResults(bankSearchInput.value.trim());
});

signupBankLogo.addEventListener('change', async function () {
  const file = signupBankLogo.files[0];
  signupLogoPreview.classList.add('hidden');
  signupLogoPreview.removeAttribute('src');
  if (!file) return;
  if (!file.type.startsWith('image/') || file.size > 1024 * 1024) {
    alert('Choose an image file no larger than 1 MB for your bank logo.');
    signupBankLogo.value = '';
    return;
  }
  try {
    signupLogoPreview.src = await readImageAsDataUrl(file);
    signupLogoPreview.classList.remove('hidden');
  } catch (error) {
    alert(error.message);
    signupBankLogo.value = '';
  }
});

settingsBankLogoInput.addEventListener('change', async function () {
  const file = settingsBankLogoInput.files[0];
  settingsLogoPreview.classList.add('hidden');
  settingsLogoPreview.removeAttribute('src');
  if (!file) {
    const currentUser = getSession();
    if (currentUser && currentUser.bankLogo) {
      settingsLogoPreview.src = currentUser.bankLogo;
      settingsLogoPreview.classList.remove('hidden');
    }
    return;
  }
  if (!file.type.startsWith('image/') || file.size > 1024 * 1024) {
    alert('Choose an image file no larger than 1 MB for your bank logo.');
    settingsBankLogoInput.value = '';
    return;
  }
  try {
    settingsLogoPreview.src = await readImageAsDataUrl(file);
    settingsLogoPreview.classList.remove('hidden');
  } catch (error) {
    alert(error.message);
    settingsBankLogoInput.value = '';
  }
});

settingsProfileForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  const currentUser = getSession();
  if (!currentUser) return;
  const firstName = settingsFirstNameInput.value.trim();
  const secondName = settingsSecondNameInput.value.trim();
  const bankName = settingsBankNameInput.value.trim();
  const bankLocation = settingsBankLocationInput.value.trim();
  const bankPhone = settingsBankPhoneInput.value.trim();
  const bankAddress = settingsBankAddressInput.value.trim();
  const bankWebsite = settingsBankWebsiteInput.value.trim();
  const bankAbout = settingsBankAboutInput.value.trim();
  const logoFile = settingsBankLogoInput.files[0];
  if (!firstName || !secondName || !bankName) {
    alert('Enter your first name, second name, and bank name.');
    return;
  }
  if (logoFile && (!logoFile.type.startsWith('image/') || logoFile.size > 1024 * 1024)) {
    alert('Choose an image file no larger than 1 MB for your bank logo.');
    return;
  }
  let bankLogo = currentUser.bankLogo || '';
  if (logoFile) {
    try {
      bankLogo = await readImageAsDataUrl(logoFile);
    } catch (error) {
      alert(error.message);
      return;
    }
  }
  const updatedUser = {
    ...currentUser,
    name: `${firstName} ${secondName}`,
    bankName,
    bankLocation,
    bankPhone,
    bankAddress,
    bankWebsite,
    bankAbout,
    bankLogo
  };
  const users = getUsers();
  const userIndex = users.findIndex(user => normalizeEmail(user.email) === normalizeEmail(currentUser.email));
  if (userIndex === -1) return;
  users[userIndex] = updatedUser;
  try {
    saveUsers(users);
    setSession(updatedUser);
    localStorage.setItem(STORAGE_BANK_PROFILE, JSON.stringify({
      ...getBankProfile(),
      name: bankName,
      location: bankLocation,
      phone: bankPhone,
      address: bankAddress,
      website: bankWebsite,
      about: bankAbout
    }));
    const posts = getTimelinePosts();
    let postsChanged = false;
    posts.forEach(post => {
      if (normalizeEmail(post.authorEmail) !== normalizeEmail(currentUser.email)) return;
      post.bankName = bankName;
      post.bankLogo = bankLogo;
      post.bankLocation = bankLocation;
      post.bankPhone = bankPhone;
      post.bankAddress = bankAddress;
      post.bankWebsite = bankWebsite;
      post.bankAbout = bankAbout;
      postsChanged = true;
    });
    if (postsChanged) saveTimelinePosts(posts);
    welcomeName.textContent = `Hi, ${updatedUser.name}`;
    renderUsers();
    renderBankProfile();
    renderTimeline();
    renderSettings();
    settingsSaveStatus.textContent = 'Profile settings saved.';
  } catch {
    alert('Your profile settings could not be saved. Browser storage may be full.');
  }
});

registrationOpenToggle.addEventListener('change', function () {
  const currentUser = getSession();
  if (!currentUser || normalizeEmail(currentUser.email) !== OWNER_EMAIL) return;
  try {
    localStorage.setItem(STORAGE_REGISTRATION_OPEN, String(registrationOpenToggle.checked));
    renderRegistrationAvailability();
  } catch {
    alert('Registration settings could not be saved.');
    registrationOpenToggle.checked = isRegistrationOpen();
  }
});

deleteAccountButton.addEventListener('click', function () {
  const currentUser = getSession();
  if (!currentUser) return;
  const password = deleteAccountPassword.value;
  if (!password || !deleteAccountConfirm.checked) {
    settingsSaveStatus.textContent = 'Enter your password and confirm account deletion to continue.';
    return;
  }

  const users = getUsers();
  const account = users.find(user => normalizeEmail(user.email) === normalizeEmail(currentUser.email));
  if (!account || account.password !== password.trim()) {
    settingsSaveStatus.textContent = 'The password is incorrect. Your account was not deleted.';
    return;
  }

  deleteAccountDialog.showModal();
});

cancelAccountDeletion.addEventListener('click', function () {
  deleteAccountDialog.close();
});

confirmAccountDeletion.addEventListener('click', function () {
  const currentUser = getSession();
  if (!currentUser) {
    deleteAccountDialog.close();
    return;
  }
  const users = getUsers();
  const account = users.find(user => normalizeEmail(user.email) === normalizeEmail(currentUser.email));
  if (!account) {
    deleteAccountDialog.close();
    settingsSaveStatus.textContent = 'Your account could not be found. No changes were made.';
    return;
  }
  const remainingUsers = users.filter(user => normalizeEmail(user.email) !== normalizeEmail(account.email));
  const deletedUsers = getDeletedUsers().filter(user => normalizeEmail(user.email) !== normalizeEmail(account.email));
  deletedUsers.push({ ...account, deletedAt: Date.now() });
  try {
    saveDeletedUsers(deletedUsers);
    saveUsers(remainingUsers);
    deleteAccountDialog.close();
    clearSession();
    deleteAccountPassword.value = '';
    deleteAccountConfirm.checked = false;
    toggleAuthMode('login');
    showAuth();
    renderUsers();
  } catch {
    deleteAccountDialog.close();
    settingsSaveStatus.textContent = 'Your account could not be deleted. Browser storage may be full.';
  }
});

recoverAccountButton.addEventListener('click', function () {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !password) {
    alert('Enter the account email and password to recover it.');
    return;
  }

  const activeUser = getUsers().find(user => normalizeEmail(user.email) === normalizedEmail);
  if (activeUser) {
    alert('This account is already active. Log in instead.');
    return;
  }
  const deletedUsers = getDeletedUsers();
  const deletedUser = deletedUsers.find(user =>
    normalizeEmail(user.email) === normalizedEmail && user.password === password
  );
  if (!deletedUser) {
    alert('No deleted account matches those credentials.');
    return;
  }
  if (deletedUser.blocked === true) {
    alert('This account is blocked. Contact the page administrator before recovering it.');
    return;
  }

  const restoredUser = { ...deletedUser };
  delete restoredUser.deletedAt;
  const users = getUsers();
  users.push(restoredUser);
  try {
    saveUsers(users);
    saveDeletedUsers(deletedUsers.filter(user => normalizeEmail(user.email) !== normalizedEmail));
    setSession(restoredUser);
    loginForm.reset();
    showChat(restoredUser);
  } catch {
    alert('Your account could not be recovered. Browser storage may be full.');
  }
});

signupForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  if (!isRegistrationOpen()) {
    alert('New account registration is currently closed.');
    renderRegistrationAvailability();
    return;
  }

  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value.trim();
  const bankName = signupBankName.value.trim();
  const bankLocation = signupBankLocation.value.trim();
  const logoFile = signupBankLogo.files[0];

  if (!name || !email || !password || !bankName || !bankLocation) {
    alert('Please complete all fields.');
    return;
  }

  if (logoFile && (!logoFile.type.startsWith('image/') || logoFile.size > 1024 * 1024)) {
    alert('Choose an image file no larger than 1 MB for your bank logo.');
    return;
  }

  if (!/^[^@\s]+@gmail\.com$/i.test(email)) {
    alert('Please sign up with a Gmail address ending in @gmail.com.');
    return;
  }

  const users = getUsers();
  const exists = users.some(user => normalizeEmail(user.email) === normalizeEmail(email));
  const wasDeleted = getDeletedUsers().some(user => normalizeEmail(user.email) === normalizeEmail(email));

  if (exists) {
    alert('This email is already registered. Try logging in.');
    return;
  }
  if (wasDeleted) {
    alert('This email belongs to a deleted account. Use Recover account from the login form.');
    toggleAuthMode('login');
    document.getElementById('loginEmail').value = email;
    return;
  }

  let bankLogo = '';
  if (logoFile) {
    try {
      bankLogo = await readImageAsDataUrl(logoFile);
    } catch (error) {
      alert(error.message);
      return;
    }
  }

  const newUser = { id: makeId(), name, email, password, bankName, bankLocation, bankLogo };
  users.push(newUser);
  try {
    saveUsers(users);
    setSession(newUser);
  } catch {
    alert('Your account could not be saved. Browser storage may be full.');
    return;
  }
  signupForm.reset();
  signupLogoPreview.classList.add('hidden');
  signupLogoPreview.removeAttribute('src');
  showChat(newUser);
});

loginForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  const users = getUsers();
  const user = users.find(item => item.email.toLowerCase() === email.toLowerCase() && item.password === password);

  if (!user) {
    alert('Incorrect email or password.');
    return;
  }
  if (user.blocked === true) {
    alert('This account is blocked. Contact the page administrator.');
    return;
  }

  setSession(user);
  loginForm.reset();
  showChat(user);
});

messageForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const currentUser = getSession();
  if (!currentUser) {
    return;
  }

  const text = messageInput.value.trim();
  if (!text) return;

  const messages = getMessages();
  const newMessage = {
    id: makeId(),
    author: getPublicBankName(currentUser),
    text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  messages.push(newMessage);
  saveMessages(messages);
  messageInput.value = '';
  renderMessages();
});

transferAmount.addEventListener('input', function () {
  const amount = Number(transferAmount.value);
  receivedAmountPreview.textContent = Number.isFinite(amount) && amount > 0
    ? formatMoney(amount)
    : formatMoney(0);
});

transferForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const amount = Number(transferAmount.value);
  const senderName = document.getElementById('senderName').value.trim();
  const receiverName = document.getElementById('receiverName').value.trim();
  const senderBank = document.getElementById('senderBank').value.trim();
  const receiverBank = document.getElementById('receiverBank').value.trim();
  const currentUser = getSession();
  if (!currentUser) return;
  if (!Number.isFinite(amount) || amount <= 0) {
    alert('Enter a transfer amount greater than zero SSP.');
    return;
  }
  if (!senderName || !receiverName || !senderBank || !receiverBank) {
    alert('Please complete the sender, receiver, and bank details.');
    return;
  }

  const transfers = getTransfers();
  transfers.push({
    id: makeId(),
    direction: document.getElementById('transferDirection').value,
    senderName,
    receiverName,
    senderBank,
    receiverBank,
    amount,
    memo: document.getElementById('transferMemo').value.trim(),
    timestamp: Date.now(),
    received: false,
    recordedBy: currentUser.email
  });
  try {
    saveTransfers(transfers);
    transferForm.reset();
    receivedAmountPreview.textContent = formatMoney(0);
    renderTransfers();
  } catch {
    alert('The transfer could not be saved. Your browser storage may be full.');
  }
});

document.querySelectorAll('[data-history-filter]').forEach(button => {
  button.addEventListener('click', function () {
    activeHistoryFilter = button.dataset.historyFilter;
    document.querySelectorAll('.history-tab').forEach(tab => {
      tab.classList.toggle('active', tab === button);
    });
    renderTransfers();
  });
});

historySearch.addEventListener('input', renderTransfers);

bankProfileForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const bankName = bankNameInput.value.trim();
  const bankLocation = bankLocationInput.value.trim();
  const bankPhone = bankPhoneInput.value.trim();
  const bankWebsite = bankWebsiteInput.value.trim();
  const bankAddress = bankAddressInput.value.trim();
  const bankAbout = bankAboutInput.value.trim();
  const customerCount = Number(dailyCustomersInput.value);
  if (!bankName || !Number.isInteger(customerCount) || customerCount < 0) {
    alert('Enter the full bank name and a valid non-negative customer count.');
    return;
  }
  try {
    localStorage.setItem(STORAGE_BANK_PROFILE, JSON.stringify({
      ...getBankProfile(),
      name: bankName,
      location: bankLocation,
      phone: bankPhone,
      website: bankWebsite,
      address: bankAddress,
      about: bankAbout
    }));
    const currentUser = getSession();
    if (currentUser) {
      const users = getUsers();
      const userIndex = users.findIndex(user => normalizeEmail(user.email) === normalizeEmail(currentUser.email));
      if (userIndex !== -1) {
        users[userIndex].bankLocation = bankLocation;
        users[userIndex].bankPhone = bankPhone;
        users[userIndex].bankWebsite = bankWebsite;
        users[userIndex].bankAddress = bankAddress;
        users[userIndex].bankAbout = bankAbout;
        saveUsers(users);
        setSession(users[userIndex]);
      }
    }
    const counts = getCustomerCounts();
    counts[getLocalDateKey(new Date())] = customerCount;
    localStorage.setItem(STORAGE_CUSTOMER_COUNTS, JSON.stringify(counts));
    renderBankProfile();
    renderTimeline();
  } catch {
    alert('The bank profile could not be saved. Your browser storage may be full.');
  }
});

async function publishTimelinePost(text, imageFile) {
  if (!text && !imageFile) {
    alert('Write a post or choose a picture to upload.');
    return false;
  }
  if (imageFile && (!imageFile.type.startsWith('image/') || imageFile.size > 1024 * 1024)) {
    alert('Choose an image file no larger than 1 MB.');
    return false;
  }

  let image = '';
  if (imageFile) {
    try {
      image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('The selected image could not be read.'));
        reader.readAsDataURL(imageFile);
      });
    } catch (error) {
      alert(error.message);
      return false;
    }
  }

  const posts = getTimelinePosts();
  const currentUser = getSession();
  const profile = getBankProfile();
  const customerCounts = getCustomerCounts();
  const customerCount = Number(customerCounts[getLocalDateKey(new Date())]) || 0;
  posts.push({
    id: makeId(),
    bankName: (currentUser && currentUser.bankName) || profile.name,
    authorEmail: currentUser ? currentUser.email : '',
    bankLogo: currentUser ? currentUser.bankLogo || '' : '',
    bankLocation: (currentUser && currentUser.bankLocation) || profile.location || '',
    text,
    image,
    customerCount,
    timestamp: Date.now(),
    reactions: {},
    comments: []
  });
  try {
    saveTimelinePosts(posts);
    renderTimeline();
    renderHomeFeed();
    return true;
  } catch {
    alert('The post could not be saved. Your browser storage may be full.');
    return false;
  }
}

postForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  const text = document.getElementById('postText').value.trim();
  const imageFile = document.getElementById('postImage').files[0];
  if (await publishTimelinePost(text, imageFile)) postForm.reset();
});

homePostForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  const text = document.getElementById('homePostText').value.trim();
  const imageFile = document.getElementById('homePostImage').files[0];
  if (await publishTimelinePost(text, imageFile)) {
    homePostForm.reset();
    setActiveView('home');
  }
});

document.querySelectorAll('[data-message-section]').forEach(button => {
  button.addEventListener('click', function () {
    setActiveMessageSection(button.dataset.messageSection);
  });
});

document.getElementById('closeTransferDetail').addEventListener('click', function () {
  transferDetailDialog.close();
});

document.getElementById('closeSharePost').addEventListener('click', function () {
  sharePostDialog.close();
  currentSharePost = null;
});

document.getElementById('closePublicBankProfile').addEventListener('click', function () {
  publicBankProfileDialog.close();
});

document.querySelectorAll('[data-share-platform]').forEach(button => {
  button.addEventListener('click', async function () {
    if (!currentSharePost) {
      alert('This post is no longer available to share.');
      sharePostDialog.close();
      return;
    }
    const post = currentSharePost;
    sharePostDialog.close();
    await shareTimelinePost(post, button.dataset.sharePlatform);
    currentSharePost = null;
  });
});

updateForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const currentUser = getSession();
  if (!currentUser || currentUser.email.toLowerCase() !== OWNER_EMAIL) {
    alert('Only the page owner can publish updates.');
    return;
  }

  const title = updateTitle.value.trim();
  const text = updateText.value.trim();
  if (!title || !text) {
    alert('Please enter an update title and details.');
    return;
  }

  const updates = getUpdates();
  updates.push({
    id: makeId(),
    title,
    text,
    author: getPublicBankName(currentUser),
    time: new Date().toLocaleString()
  });
  saveUpdates(updates);
  updateForm.reset();
  renderUpdates();
  renderNotificationBadge();
});

logoutBtn.addEventListener('click', function () {
  clearSession();
  showAuth();
});

document.querySelectorAll('.nav-button').forEach(button => {
  button.addEventListener('click', function () {
    setActiveView(button.dataset.view);
  });
});

document.querySelectorAll('[data-go-view]').forEach(button => {
  button.addEventListener('click', function () {
    setActiveView(button.dataset.goView);
  });
});

activityHistoryToggle.addEventListener('click', function () {
  const willOpen = activityHistoryPanel.classList.contains('hidden');
  activityHistoryPanel.classList.toggle('hidden', !willOpen);
  activityHistoryToggle.setAttribute('aria-expanded', String(willOpen));
  if (willOpen) renderActivityHistory();
});

document.getElementById('closeActivityHistory').addEventListener('click', function () {
  activityHistoryPanel.classList.add('hidden');
  activityHistoryToggle.setAttribute('aria-expanded', 'false');
});

window.addEventListener('storage', function (event) {
  if ([STORAGE_UPDATES, STORAGE_TRANSFER_NOTIFICATIONS, STORAGE_READ_TRANSFER_NOTIFICATIONS,
    STORAGE_MESSAGES, STORAGE_TRANSFERS, STORAGE_TIMELINE_POSTS,
    STORAGE_BANK_PROFILE, STORAGE_CUSTOMER_COUNTS, STORAGE_BRANCH_REQUESTS,
    STORAGE_DIRECT_MESSAGES, STORAGE_USERS, STORAGE_DELETED_USERS, STORAGE_REGISTRATION_OPEN].includes(event.key)) {
    if (event.key === STORAGE_REGISTRATION_OPEN) renderRegistrationAvailability();
    if ([STORAGE_UPDATES, STORAGE_TRANSFER_NOTIFICATIONS].includes(event.key)) {
      renderUpdates();
      renderNotificationBadge();
    }
    if (event.key === STORAGE_READ_TRANSFER_NOTIFICATIONS) renderNotificationBadge();
    if (event.key === STORAGE_MESSAGES && !document.getElementById('messagesView').classList.contains('hidden')) renderMessages();
    if (event.key === STORAGE_TRANSFERS) {
      renderTransfers();
      if (!activityHistoryPanel.classList.contains('hidden')) renderActivityHistory();
    }
    if ([STORAGE_TIMELINE_POSTS, STORAGE_BANK_PROFILE, STORAGE_CUSTOMER_COUNTS].includes(event.key) &&
        !document.getElementById('timelineView').classList.contains('hidden')) {
      renderBankProfile();
      renderTimeline();
    }
    if ([STORAGE_BRANCH_REQUESTS, STORAGE_USERS, STORAGE_DELETED_USERS].includes(event.key)) {
      renderUsers();
      renderBranchRequests();
      renderBranchRequests(mainBranchInvitationList);
      renderBranchRequests(notificationBranchRequestList, true);
      renderNotificationBadge();
      if (selectedBankEmail) renderSearchedBankProfile(findUserByEmail(selectedBankEmail));
      if (!document.getElementById('settingsView').classList.contains('hidden')) renderSettings();
      if (event.key === STORAGE_USERS) {
        const sessionUser = getSession();
        const latestUser = sessionUser && findUserByEmail(sessionUser.email);
        if (sessionUser && (!latestUser || latestUser.blocked === true)) {
          clearSession();
          showAuth();
        } else if (latestUser) {
          setSession(latestUser);
        }
      }
    }
    if (event.key === STORAGE_DIRECT_MESSAGES && selectedBankEmail && !directMessagePanel.classList.contains('hidden')) {
      renderDirectMessages(findUserByEmail(selectedBankEmail));
    }
  }
});

document.querySelectorAll('.tab').forEach(button => {
  button.addEventListener('click', function () {
    toggleAuthMode(button.dataset.mode);
  });
});

document.getElementById('showLoginFromSignup').addEventListener('click', function () {
  toggleAuthMode('login');
});

seedDemoAccount();
renderUsers();
renderRegistrationAvailability();

const session = getSession();
if (session) {
  showChat(session);
} else {
  showAuth();
}