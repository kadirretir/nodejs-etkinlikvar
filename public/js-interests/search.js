    // İlgi alanlarını arama işlevi
    document.getElementById("searchinterests").addEventListener("input", function() {
        var inputValue = this.value.toLowerCase();
        var interestsResults = document.getElementById("interestsResults");
        const searchInput = document.getElementById("searchinterests");

        if (inputValue === "") {
        interestsResults.innerHTML = "";
        return;
    }
        // İlgi alanlarından arama
        var count = 0;
        var allSubCategories = [].concat.apply([], subCategories);
        interestsResults.innerHTML = ""; 

        for (var i = 0; i < allSubCategories.length; i++) {
        var interest = allSubCategories[i].toLowerCase();
        if (interest.indexOf(inputValue) !== -1 && count < 5) {
            var resultElement = document.createElement("div");
            resultElement.textContent = allSubCategories[i];
            interestsResults.appendChild(resultElement);
            resultElement.addEventListener("click", () => {
                interestsResults.innerHTML = ""; 
                searchInput.value = "";
            });
            count++;
        }
    }
    });

    document.addEventListener("click", function(event) {
        const isClickedInsideSearch = event.target.closest("#searchinterests") !== null;
        const isClickedInsideResults = event.target.closest("#interestsResults") !== null;
    
        if (!isClickedInsideSearch && !isClickedInsideResults) {
            interestsResults.innerHTML = "";
        }
    });