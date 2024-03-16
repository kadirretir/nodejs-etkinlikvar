document.addEventListener('DOMContentLoaded', function() {
    // Kaydet butonunu dinleyen fonksiyonu tanımla
    const handleSaveButtonClick = function(event) {
          const selectedButtons = document.querySelectorAll('#selectedCategoriesContainer div');
          const selectedContents = Array.from(selectedButtons).map(button => button.textContent); 
      
          const data = {
              selectedContents: selectedContents
          };
  
  
          if(data.selectedContents.length > 0) {
              fetch("http://localhost:3000/user/interests", {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          })
          .then(response => {
              if (response.ok) {
                  console.log('İstek başarıyla gönderildi.');
                  // İstek başarılı ise burada yapılacak işlemleri ekleyebilirsiniz
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
  });