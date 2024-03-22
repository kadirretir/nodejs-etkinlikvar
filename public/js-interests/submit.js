
  function initializeDynamicSubmit () {
    let dynamicUserId = getUser._id;
    const handleSaveButtonClick = function(event) {
   
          const selectedButtons = document.querySelectorAll('#selectedCategoriesContainer button');
          const selectedContents = Array.from(selectedButtons).map(button => button.textContent); 
      
          const data = {
              selectedContents: selectedContents
          };
        
          console.log(dynamicUserId)
          if(data.selectedContents.length > 0) {
            saveButton.disabled = true;
            saveButton.insertAdjacentHTML('beforeend', `
            <div class="spinner-border ms-2 spinner-border-sm text-primary" role="status">
              <span class="visually-hidden">Yükleniyor...</span>
            </div>
          `);
              fetch("/user/interests", {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          })
          .then(response => {
              if (response.ok) {
            setTimeout(() => {
                window.location.href = `/members/${dynamicUserId}`
            }, 500)
                  
    
              } else {
                  console.error('İstek gönderilirken bir hata oluştu.');
                  // İstek başarısız ise burada yapılacak işlemleri ekleyebilirsiniz
              }
          })
          .catch(error => {
              console.error('Bir hata oluştu:', error);
          });
          } else {
            window.location.href = `/members/${dynamicUserId}`
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
