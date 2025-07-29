document.addEventListener('DOMContentLoaded', function () {
  const swiper = new Swiper('.hero-swiper', {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 20,
    grabCursor: true,

    navigation: {
      nextEl: '.button-next',
      prevEl: '.button-prev',
    },

    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    
  });
});

// ----------------------------------------------------------- //
const faqItems = document.querySelectorAll('.faq-item');
const aboutContent = document.querySelector('.about-content');
const videoBg = document.querySelector('.about-section .about-content .video-background');
console.log(videoBg);

faqItems[0].classList.add('active');
videoBg.style.opacity = '1';
aboutContent.style.backgroundImage = 'none';

faqItems.forEach((item, index) => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        faqItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        switch(index) {
            case 0:
                videoBg.style.opacity = '1';
                aboutContent.style.backgroundImage = 'none';
                break;
            case 1:
                videoBg.style.opacity = '0';
                setTimeout(() => {
                    aboutContent.style.backgroundImage = 'url("/images/about/1.webp")';
                }, 300);
                break;
            case 2:
                videoBg.style.opacity = '0';
                setTimeout(() => {
                    aboutContent.style.backgroundImage = 'url("/images/about/2.webp")';
                }, 300);
                break;
        }
    });
});
// -------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', function() {
    // Select all icon elements
    const icons = document.querySelectorAll('.services-section .icon');
    
    // Add click event to each icon
    icons.forEach(icon => {
        icon.addEventListener('click', function() {
            // Remove active class from all services items
            document.querySelectorAll('.services-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to the parent services-item
            this.closest('.services-item').classList.add('active');
        });
    });
});


// ----------------------------------------------------------- //


Dropzone.autoDiscover = false;

document.addEventListener('DOMContentLoaded', function() {
    const myDropzone = new Dropzone("#myDropzone", {
        url: "http://api.ikhwadigital.com/api/karihome/contact",
        autoProcessQueue: false,
        maxFilesize: 2,
        acceptedFiles: ".jpg,.jpeg,.png,.pdf,.xlsx,.docx",
        addRemoveLinks: true,
        dictDefaultMessage: "",
        dictFileTooBig: "File is too big ({{filesize}}MB). Max filesize: {{maxFilesize}}MB.",
        dictInvalidFileType: "This file type is not allowed.",
        dictRemoveFile: "Delete file",
        init: function() {
            this.on("addedfile", function(file) {
                if (file.name.length > 30) {
                    const truncatedName = file.name.substring(0, 30) + '...';
                    file.previewElement.querySelector(".dz-filename span").textContent = truncatedName;
                    file.previewElement.querySelector(".dz-filename span").title = file.name;
                }
            });

            const form = document.getElementById('contactForm');
            const submitBtn = document.querySelector('.submit-btn');
            
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const name = document.getElementById("name").value.trim();
                const email = document.getElementById("email").value.trim();
                const phone = document.getElementById("phone").value.trim();
                
                if (!name) {
                    showAlert("Name field is required", "danger");
                    return;
                }
                
                if (!email) {
                    showAlert("Email field is required", "danger");
                    return;
                } else if (!/^\S+@\S+\.\S+$/.test(email)) {
                    showAlert("Invalid email address", "danger");
                    return;
                }
                
                if (!phone) {
                    showAlert("Phone field is required", "danger");
                    return;
                }

                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Sending...
                `;

                const formData = new FormData();
                formData.append("name", name);
                formData.append("email", email);
                formData.append("phone", phone);
                formData.append("description", document.getElementById("description").value);
                
                if (document.getElementById("radio1").checked) formData.append("option", "Inquiry");
                else if (document.getElementById("radio2").checked) formData.append("option", "Suggestion");
                else if (document.getElementById("radio3").checked) formData.append("option", "Complaint");

                if (myDropzone.files.length > 0) {
                    formData.append("file", myDropzone.files[0]);
                }

                try {
                    const response = await fetch("http://api.ikhwadigital.com/api/karihome/contact", {
                        method: "POST",
                        body: formData,
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok) {
                        showAlert("Message sent successfully", "success");
                        
                        form.reset();
                        myDropzone.removeAllFiles();
                    } else {
                        showAlert(result.message || "Failed to send message", "danger");
                    }
                    
                } catch (error) {
                    showAlert("Error connecting to server", "danger");
                    console.error(error);
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Submit";
                }
            });
        }
    });
});

function showAlert(message, type) {
    const oldAlert = document.querySelector('.alert');
    if (oldAlert) oldAlert.remove();
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} mt-3`;
    alertDiv.textContent = message;
    
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(alertDiv, form.nextSibling);
    
    setTimeout(() => alertDiv.remove(), 5000);
}