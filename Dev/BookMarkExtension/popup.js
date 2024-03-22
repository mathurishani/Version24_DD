document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('searchInput');
  const bookmarkList = document.getElementById('bookmarkList');
  const addBookmarkBtn = document.getElementById('addBookmarkBtn');
  const deleteBookmarkBtn = document.getElementById('deleteBookmarkBtn');

  // Load bookmarks
  chrome.bookmarks.getTree(function (bookmarks) {
    displayBookmarks(bookmarks[0].children[0].children);
  });

  // Display bookmarks
  function displayBookmarks(bookmarks) {
    bookmarkList.innerHTML = '';
    bookmarks.forEach(bookmark => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = bookmark.title;
      a.href = bookmark.url;
      a.target = '_blank';
      li.appendChild(a);
      bookmarkList.appendChild(li);
    });
  }

  // Add bookmark button click handler
  addBookmarkBtn.addEventListener('click', function () {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      const tab = tabs[0];
      chrome.bookmarks.create({ title: tab.title, url: tab.url });
      // Reload bookmarks after adding
      chrome.bookmarks.getTree(function (bookmarks) {
        displayBookmarks(bookmarks[0].children[0].children);
      });
    });
  });

  // Delete bookmark button click handler
  deleteBookmarkBtn.addEventListener('click', function () {
    // Implement delete functionality here
    // Reload bookmarks after deleting
    chrome.bookmarks.getTree(function (bookmarks) {
      displayBookmarks(bookmarks[0].children[0].children);
    });
  });

  // Search input event listener
  searchInput.addEventListener('input', function () {
    const query = searchInput.value.toLowerCase();
    chrome.bookmarks.search(query, function (results) {
      displayBookmarks(results);
    });
  });
});
