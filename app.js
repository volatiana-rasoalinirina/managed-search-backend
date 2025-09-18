document.addEventListener('DOMContentLoaded', () => {

    const uploadBtn = document.getElementById('upload-btn');
    const csvFileInput = document.getElementById('csv-file');
    const uploadStatus = document.getElementById('upload-status');
    const searchSection = document.getElementById('search-section');
    const endpointUrl = document.getElementById('endpoint-url');
    const searchBtn = document.getElementById('search-btn');
    const searchQueryInput = document.getElementById('search-query');
    const resultsSection = document.getElementById('results-section');
    const resultsContainer = document.getElementById('results-container');

    let searchUrl = '';

    // UPLOAD
    uploadBtn.addEventListener('click', async () => {
        const file = csvFileInput.files[0];
        if (!file) {
            uploadStatus.textContent = "Veuillez d'abord sélectionner un fichier !";
            return;
        }

        uploadStatus.textContent = 'Téléversement et indexation en cours...';
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/api/upload/', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Le téléversement a échoué');
            }

            uploadStatus.textContent = `Succès ! L'index '${data.index_name}' a été créé.`;
            uploadStatus.style.color = 'green';

            searchUrl = data.search_url;
            endpointUrl.textContent = `http://localhost:8000${data.search_url}`;
            searchSection.style.display = 'block';

        } catch (error) {
            uploadStatus.textContent = `Erreur : ${error.message}`;
            uploadStatus.style.color = 'red';
        }
    });

    // SEARCH
    searchBtn.addEventListener('click', async () => {
        const query = searchQueryInput.value;
        resultsContainer.innerHTML = '';

        if (!query || !searchUrl) {
            resultsSection.style.display = 'block';
            resultsContainer.innerHTML = '<span style="color: orange;">Veuillez entrer un terme de recherche.</span>';
            return;
        }

        resultsSection.style.display = 'block';
        resultsContainer.innerHTML = 'Recherche en cours...';

        try {
            const absoluteSearchUrl = `http://localhost:8000${searchUrl}?q=${encodeURIComponent(query)}`;
            const response = await fetch(absoluteSearchUrl);
            const results = await response.json();

            if (!response.ok) {
                throw new Error(results.error || 'La recherche a échoué');
            }

            if (results.length === 0) {
                resultsContainer.innerHTML = 'Aucun résultat trouvé.';
                return;
            }

            resultsContainer.innerHTML = '';

            results.forEach(hit => {
                const sourceData = hit._source;
                const preElement = document.createElement('pre');
                preElement.textContent = JSON.stringify(sourceData, null, 2);
                resultsContainer.appendChild(preElement);
            });

        } catch (error) {
            resultsContainer.innerHTML = `<span style="color: red;">Erreur : ${error.message}</span>`;
        }
    });
});