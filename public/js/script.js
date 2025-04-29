document.addEventListener('DOMContentLoaded', function() {
  const methodSelect = document.getElementById('method');
  const nonAddressFields = document.getElementById('nonAddressFields');
  const addressFields = document.getElementById('addressFields');
  
  methodSelect.addEventListener('change', function() {
    if(this.value === 'address'){
      nonAddressFields.style.display = 'none';
      addressFields.style.display = 'block';
    } else {
      nonAddressFields.style.display = 'block';
      addressFields.style.display = 'none';
    }
  });
});
