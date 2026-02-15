// Pagination Component for handling page navigation in data tables.
class Pagination {
  constructor(
    paginationContainerId = "#pagination-container",
    paginationInfoId = "#pagination-info",
    paginationNavId = "#pagination",
  ) {
    this.paginationContainer = document.querySelector(paginationContainerId);
    this.paginationInfoElm = document.querySelector(paginationInfoId);
    this.paginationNavElm = document.querySelector(paginationNavId);
    this.onPageChange = null;
    this.currentPage = 1;
    this.totalPages = 1;
  }

  renderContainer() {
    const containerHTML = `
      <div class="container-fluid pb-3">
        <!-- Pagination row -->
        <div class="d-flex justify-content-between align-items-center mt-3">
          <small id="pagination-info" class="text-muted"></small>
          <nav>
            <ul id="pagination" class="pagination mb-0"></ul>
          </nav>
        </div>
      </div>
    `;
    if (this.paginationContainer) {
      this.paginationContainer.innerHTML = containerHTML;
      this.paginationInfoElm = document.querySelector("#pagination-info");
      this.paginationNavElm = document.querySelector("#pagination");
    }
  }
  render(currentPage, totalPages, totalItems, pageSize) {
    this.currentPage = currentPage;
    this.totalPages = totalPages;
    const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    //On the last page, there might be fewer items than current x pageSize, that why we use math.min:
    const end = Math.min(currentPage * pageSize, totalItems);
    this.paginationInfoElm.textContent = `Showing ${start}–${end} of ${totalItems}`;

    this.paginationNavElm.innerHTML = "";

    // Previous button
    const prevLi = document.createElement("li");
    prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
    prevLi.innerHTML = `<button class="page-link">Previous</button>`;
    prevLi.addEventListener("click", () => {
      if (currentPage > 1 && this.onPageChange)
        this.onPageChange(currentPage - 1);
    });
    this.paginationNavElm.appendChild(prevLi);

    // Page numbers
    const maxVisiblePages = 3; // Maximum number of page numbers to show
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page + ellipsis if needed
    if (startPage > 1) {
      this._createPageButton(1);
      if (startPage > 2) {
        const ellipsisLi = document.createElement("li");
        ellipsisLi.className = "page-item disabled";
        ellipsisLi.innerHTML = `<span class="page-link">...</span>`;
        this.paginationNavElm.appendChild(ellipsisLi);
      }
    }

    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      this._createPageButton(i);
    }

    // Ellipsis + last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        const ellipsisLi = document.createElement("li");
        ellipsisLi.className = "page-item disabled";
        ellipsisLi.innerHTML = `<span class="page-link">...</span>`;
        this.paginationNavElm.appendChild(ellipsisLi);
      }
      this._createPageButton(totalPages);
    }

    // Next button
    const nextLi = document.createElement("li");
    nextLi.className = `page-item ${currentPage >= totalPages ? "disabled" : ""}`;
    nextLi.innerHTML = `<button class="page-link">Next</button>`;
    nextLi.addEventListener("click", () => {
      if (currentPage < totalPages && this.onPageChange)
        this.onPageChange(currentPage + 1);
    });
    this.paginationNavElm.appendChild(nextLi);
  }

  _createPageButton(pageNum) {
    const pageLi = document.createElement("li");
    pageLi.className = `page-item ${pageNum === this.currentPage ? "active" : ""}`;
    pageLi.innerHTML = `<button class="page-link">${pageNum}</button>`;
    pageLi.addEventListener("click", () => {
      if (this.onPageChange && pageNum !== this.currentPage) {
        this.onPageChange(pageNum);
      }
    });
    this.paginationNavElm.appendChild(pageLi);
  }
}
export default Pagination;
