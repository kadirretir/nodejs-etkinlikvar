
  function initializeDynamicSubmit () {
    // Kaydet butonunu dinleyen fonksiyonu tanımla
    const handleSaveButtonClick = function(event) {
    
          const selectedButtons = document.querySelectorAll('#selectedCategoriesContainer button');
          const selectedContents = Array.from(selectedButtons).map(button => button.textContent); 
      
          const data = {
              selectedContents: selectedContents
          };
    
  
          if(data.selectedContents.length > 0) {
              fetch("/user/interests", {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          })
          .then(response => {
              if (response.ok) {
            const getErrorElem = document.getElementById("errorMessageInterests");
            const div = document.createElement("div");

            // Bootstrap yükleniyor animasyonu için gerekli class'ları ekle
            div.className = "d-flex justify-content-center flex-column align-items-center";
            
            // Yükleniyor animasyonunu içeren HTML'i ayarla
            div.innerHTML = `
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Yükleniyor...</span>
            </div>
            <h2 class="fs-4">İlgi alanlarınızı aldık. Yönlendiriliyorsunuz...</h2>
            `;
            getErrorElem.appendChild(div)
            setTimeout(() => {
                window.location.href = "/user/profile"
            }, 1000)
                  
    
              } else {
                  console.error('İstek gönderilirken bir hata oluştu.');
                  // İstek başarısız ise burada yapılacak işlemleri ekleyebilirsiniz
              }
          })
          .catch(error => {
              console.error('Bir hata oluştu:', error);
          });
          } else {
              event.preventDefault(); // Sayfanın yeniden yüklenmesini önlemek için
              const getErrorElem = document.getElementById("errorMessageInterests");
  
              if (getErrorElem && !getErrorElem.querySelector('p')) {
                  const p = document.createElement("p");
                  p.className = "text-danger fs-5 my-3 text-center";
                  p.textContent = "İlgi alanlarınızı seçebilirsiniz ya da vazgeçebilirsiniz.";
                  getErrorElem.appendChild(p);
      }
          }
       
      };
  
      // Kaydet butonunu bul ve tıklayınca handleSaveButtonClick fonksiyonunu çalıştır
      const saveButton = document.getElementById('saveButton');
      saveButton.addEventListener('click', handleSaveButtonClick);
      
      // DOM değişikliklerini izleyen bir izleyici oluştur
      const observer = new MutationObserver(mutationsList => {
          mutationsList.forEach(mutation => {
              if (mutation.type === 'childList') {
                  // selectedCategoriesContainer içeriğinde bir değişiklik olduğunda kaydet butonunu tekrar dinle
                  saveButton.removeEventListener('click', handleSaveButtonClick);
                  saveButton.addEventListener('click', handleSaveButtonClick);
              }
          });
      });
  
      // İzlemek istediğiniz DOM düğümünü belirtin
      const targetNode = document.getElementById('selectedCategoriesContainer');
  
      // İzleyiciyi hedeflenen düğüme bağlayın ve izlemek istediğiniz türleri belirtin
      const config = { childList: true, subtree: true };
      observer.observe(targetNode, config);
  };
