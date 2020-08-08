// logo
lottie.loadAnimation({
    container: document.getElementById('logo'),
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: '/assets/animation/logo.json',
    preserveAspectRatio: 'xMidYMid slice'
});

// modals
const modalButtons = document.querySelectorAll('[data-modal]');
for(let i = 0; i < modalButtons.length; i++) {
    modalButtons[i].addEventListener('click', onModalButtonClick);
}

let disabledHandle;
let keyHandle;
let hiddenHandle;
let focusedElementBeforeDialogOpened;

function onModalButtonClick(event) {
    event.preventDefault();
    const modal = event.target.dataset.modal;
    const modalElement = document.getElementById('modal-' + modal);
    focusedElementBeforeDialogOpened = document.activeElement;
    modalElement.querySelector('.modal__close').addEventListener('click', closeModal);
    document.body.classList.add('noscroll');

    disabledHandle = ally.maintain.disabled({
        filter: modalElement,
    });
    hiddenHandle = ally.maintain.hidden({
        filter: modalElement,
    });
    keyHandle = ally.when.key({
        escape: closeModalByKey,
    });

    ally.when.visibleArea({
        context: modalElement,
        area: 0.5,
        callback: function(context) {
          let element = ally.query.firstTabbable({
            context: context,
            defaultToContext: true,
          });
          element.focus();
        },
    });

    modalElement.hidden = false;
}

function closeModal(event) {
    const modalElement = document.querySelector('[role="dialog"]:not([hidden])');
    modalElement.querySelector('.modal__close').removeEventListener('click', closeModal);
    modalElement.hidden = true;
    disabledHandle.disengage();
    hiddenHandle.disengage();
    keyHandle.disengage();
    focusedElementBeforeDialogOpened.focus();
    document.body.classList.remove('noscroll');
}

function closeModalByKey() {
    setTimeout(closeModal);
}

// focus styles
function handleFirstTab(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
        
        window.removeEventListener('keydown', handleFirstTab);
        window.addEventListener('mousedown', handleMouseDownOnce);
    }
}
function handleMouseDownOnce() {
    document.body.classList.remove('user-is-tabbing');
    window.removeEventListener('mousedown', handleMouseDownOnce);
    window.addEventListener('keydown', handleFirstTab);
}
window.addEventListener('keydown', handleFirstTab);
