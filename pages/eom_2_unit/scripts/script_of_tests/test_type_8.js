var planeText = document.querySelector('.test_wrapper_type_10');
function checkBtnStatus(){
    var testData = data[`index_${currentPageIndex}`];
    var attempts = parseInt(localStorage.getItem(`attempts_${currentPageIndex}`));
    if(blockButtonEOM2 == 1 && attempts !== 0 && testData.hasOwnProperty('test')){
        backWardBtn.classList.add('gray_dis');
        backWardBtn.disabled = true;
        nextBtn.classList.add('gray_dis');
        nextBtn.disabled = true;
    } else {
        backWardBtn.classList.remove('gray_dis');
        backWardBtn.disabled = false;
        nextBtn.classList.remove('gray_dis');
        nextBtn.disabled = false;
    }
}
checkBtnStatus();
document.querySelector('#control_button_2').style.display = `inline-block`;
if (!planeText) {
    function createTest(index){
        var test = data[index].test;
        if (test.paragraph_1){
            document.getElementById('control_button_1').classList.remove('gray_dis');
            document.getElementById('control_button_1').disabled = false;
            document.getElementById('control_button_4').classList.remove('gray_dis');
            document.getElementById('control_button_4').disabled = false;
            return; // Прерываем выполнение функции
        };
        var imageObj = test.find(item => item.image);
        answerButton.onclick = () => {checkAnswer10()};
        function createMainElement(){
            var testWrapper = document.createElement('div');
            testWrapper.classList = `test_wrapper_type_10`;
            var startField = test.find(item => item.definitions);
            var targetField = test.find(item => item.answers);
            var mainDiv = `
            <div class="test_typ_10_content">
                <div class="mapping">
                <!-- Стартовая колонка -->
                    <div class="startColumn">
                        ${startField.definitions.map((item, index) => `
                        <div class="element_div">
                            <div class="definition" id="definition_${index+1}">${item}</div>
                            <div id="startField${index+1}" class="svgLayout"></div>
                        </div>`).join('')}
                    </div>
                    <div class="targetColumn">
                        ${targetField.answers.map((item, index) => `
                        <div class="element_div">
                            <div id="targetField${index+1}" class="svgLayout"></div>
                            <div class="targetField" id="targetfield_${index+1}">${item}</div>
                        </div>`).join('')}
                    </div>
                </div>
            </div>`;
            contentDiv.appendChild(testWrapper);
            testWrapper.innerHTML += mainDiv;
            var imageWrapper = document.createElement('div');
            imageWrapper.classList.add('image_wrapper');
            addZoomBtn();
            if (imageObj && imageObj.image){
                var imgElement;
                if (imageObj.image_path.includes(".jpg") || imageObj.image_path.includes(".png")){
                    imgElement = document.createElement('img');
                }else if (imageObj.image_path.includes(".mp4")){
                    imgElement = document.createElement('video');
                    imgElement.controls = "controls";
                }
                imgElement.src = imageObj.image_path
                imgElement.alt = 'Test Image';
                imgElement.className = 'test_image';
                imageWrapper.appendChild(imgElement);
                imgElement.onload = function() {
                    createTestElement();
                }
            }
            testWrapper.appendChild(imageWrapper);
        };
        // Обновление глобальных переменных, которые будут хранить данные
        var globalDraw;
        var circles = {};
        var lines = {};
        var startPositions = {};
        var occupiedTargets = {}; // key: targetFieldId, value: circleIndex
        var circleOccupancy = {}; // key: circleIndex, value: targetFieldId or null
        function updateSVG_Type7() {
            var planeText = document.querySelector('.test_wrapper_type_10');
            if (planeText) {
                var mappingRect = document.querySelector('.mapping').getBoundingClientRect();
                // Пересчитываем стартовые позиции
                for (var i = 1; i <= Object.keys(startPositions).length; i++) {
                    var startField = document.getElementById('startField' + i);
                    var startRect = startField.getBoundingClientRect();
                    // Обновляем стартовые позиции
                    var startX = startRect.left - mappingRect.left + startRect.width / 2;
                    var startY = startRect.top - mappingRect.top + startRect.height / 2;
                    startPositions[i] = { x: startX, y: startY };
                }
                // Обновляем позиции кругов и линий
                for (var i = 1; i <= Object.keys(circles).length; i++) {
                    var circle = circles[i];
                    var line = lines[i];
                    var isOnTarget = circleOccupancy[i] !== null;
                    if (isOnTarget) {
                        // Круг находится на таргете; обновляем его позицию
                        var targetFieldId = circleOccupancy[i];
                        var targetField = document.getElementById(targetFieldId);
                        var targetRect = targetField.getBoundingClientRect();
                        var targetCenterX = targetRect.left - mappingRect.left + targetRect.width / 2;
                        var targetCenterY = targetRect.top - mappingRect.top + targetRect.height / 2;
                        // Перемещаем круг на новую позицию таргета
                        circle.center(targetCenterX, targetCenterY);
                        // Обновляем линию
                        line.plot(startPositions[i].x, startPositions[i].y, targetCenterX, targetCenterY);
                    } else {
                        // Круг находится на стартовой позиции; обновляем позицию
                        var startX = startPositions[i].x;
                        var startY = startPositions[i].y;
                        circle.center(startX, startY);
                        // Обновляем линию
                        line.plot(startX, startY, startX, startY);
                    }
                }
            }
            // Пересчитываем координаты и обновляем SVG элементы

        }
        var result; // Глобальная переменная для хранения результата
        // Создание теста и SVG элементов
        function createTestElement() {
            var elementTestScore = document.querySelectorAll('.element_div');
            globalDraw = SVG().addTo('.mapping').size('100%', '100%').attr({ style: 'position: absolute; top: 0; left: 0;' });
            var mappingRect = document.querySelector('.mapping').getBoundingClientRect();
            for (var i = 1; i <= (elementTestScore.length) / 2; i++) {
                var startField = document.getElementById('startField' + i);
                var startRect = startField.getBoundingClientRect();
                var startX = startRect.left - mappingRect.left + startRect.width / 2;
                var startY = startRect.top - mappingRect.top + startRect.height / 2;
                startPositions[i] = { x: startX, y: startY };
                var line = globalDraw.line().plot(startX, startY, startX, startY).stroke({ width: 4, color: '#476DD5' });
                lines[i] = line;
                var circle = globalDraw.circle(35).fill('#476DD5').center(startX, startY).attr('id', 'draggableCircle' + i);
                circles[i] = circle;
                circleOccupancy[i] = null;
                circle.draggable().on('dragmove', function () {
                    var index = parseInt(this.attr('id').replace('draggableCircle', ''));
                    var newX = this.cx();
                    var newY = this.cy();
                    lines[index].plot(startPositions[index].x, startPositions[index].y, newX, newY);
                });
                circle.on('dragend', function () {
                    var index = parseInt(this.attr('id').replace('draggableCircle', ''));
                    var circleRect = this.node.getBoundingClientRect();
                    var mappingRect = document.querySelector('.mapping').getBoundingClientRect();
                    var circleCenterX = circleRect.left - mappingRect.left + circleRect.width / 2;
                    var circleCenterY = circleRect.top - mappingRect.top + circleRect.height / 2;
                    var overTarget = false;
                    var targetFieldId = '';
                    for (var j = 1; j <= Object.keys(startPositions).length; j++) {
                        var targetField = document.getElementById('targetField' + j);
                        var targetRect = targetField.getBoundingClientRect();
                        var targetCenterX = targetRect.left - mappingRect.left + targetRect.width / 2;
                        var targetCenterY = targetRect.top - mappingRect.top + targetRect.height / 2;
                        var distanceX = Math.abs(circleCenterX - targetCenterX);
                        var distanceY = Math.abs(circleCenterY - targetCenterY);
                        if (distanceX < targetRect.width / 2 && distanceY < targetRect.height / 2) {
                            overTarget = true;
                            targetFieldId = 'targetField' + j;
                            break;
                        }
                    }
                    if (overTarget) {
                        // Логика замещения кругов
                        if (circleOccupancy[index] && circleOccupancy[index] !== targetFieldId) {
                            var previousTargetFieldId = circleOccupancy[index];
                            delete occupiedTargets[previousTargetFieldId];
                        }
                        var occupyingCircleIndex = occupiedTargets[targetFieldId];
                        if (occupyingCircleIndex !== undefined && occupyingCircleIndex !== index) {
                            circles[occupyingCircleIndex].animate(300).center(startPositions[occupyingCircleIndex].x, startPositions[occupyingCircleIndex].y);
                            lines[occupyingCircleIndex].plot(startPositions[occupyingCircleIndex].x, startPositions[occupyingCircleIndex].y, startPositions[occupyingCircleIndex].x, startPositions[occupyingCircleIndex].y);
                            circleOccupancy[occupyingCircleIndex] = null;
                        }
                        occupiedTargets[targetFieldId] = index;
                        circleOccupancy[index] = targetFieldId;
                        result = Object.values(circleOccupancy).map(value => {
                            const number = value?.replace('targetField', '');
                            return isNaN(number) ? null : Number(number);
                        }).filter(num => num !== null);
                        console.log(result); // Глобальная переменная для хранения результата
                        // Обновляем правильные ответы
                        console.log(test)
                        var correctAnswersObj = test.find(item => item.correct_answer_type_10);
                        // Извлекаем массив, если объект найден
                        var correctAnswers = correctAnswersObj ? correctAnswersObj.correct_answer_type_10 : null;
                        console.log(correctAnswers); // Глобальная переменная для правильных ответов
                        function checkLength() {
                            if (result.length != Object.keys(correctAnswers).length) {
                                answerButton.classList.add('gray_dis');
                                answerButton.disabled = true;
                            } else {
                                var attempts = parseInt(localStorage.getItem(`attempts_${currentPageIndex}`));
                                if(attempts !== 0){answerButton.classList.remove('gray_dis');
                                answerButton.disabled = false;}
                            }
                        }
                        checkLength();
                        // Перемещаем круг в центр таргет-поля
                        var targetRect = document.getElementById(targetFieldId).getBoundingClientRect();
                        var targetCenterX = targetRect.left - mappingRect.left + targetRect.width / 2;
                        var targetCenterY = targetRect.top - mappingRect.top + targetRect.height / 2;
                        this.animate(300).center(targetCenterX, targetCenterY);
                        lines[index].plot(startPositions[index].x, startPositions[index].y, targetCenterX, targetCenterY);
                    } else {
                        this.animate(300).center(startPositions[index].x, startPositions[index].y);
                        lines[index].plot(startPositions[index].x, startPositions[index].y, startPositions[index].x, startPositions[index].y);
                        if (circleOccupancy[index]) {
                            delete occupiedTargets[circleOccupancy[index]];
                            circleOccupancy[index] = null;
                        }
                    }
                });
            }
            window.addEventListener('resize', debounce(updateSVG_Type7, 100)); // Добавляем обработчик изменения размера окна
        };
        createMainElement();
        // ЭТО ДЛЯ ОШИБОК
        var element = document.querySelector('.number_of_step');
        var number = parseInt(element.textContent, 10);
        function initializeAttempts(){
            var attempts = localStorage.getItem(`attempts_${number}`);
            if (!attempts){
                localStorage.setItem(`attempts_${number}`, '2'); // Устанавливаем 2 попытки
            };
        };
        // ЭТО ДЛЯ ОШИБОК
        initializeAttempts();
        function findPreviousParagraph1(currentIndex){
            var keys = Object.keys(data);
            var currentIndexPosition = keys.indexOf(currentIndex);
            // Ищем ближайший предыдущий paragraph_1
            for (var i = currentIndexPosition - 1; i >= 0; i--){
                var key = keys[i];
                if (data[key].paragraph_1){
                    return key; // Возвращаем индекс с найденным paragraph_1
                };
            };
            return null; // Если не найдено
        };
        // ЭТО ДЛЯ ОШИБОК
        // Пример использования
        function toTheoryPage(){
            var element = document.querySelector('.number_of_step');
            var number = parseInt(element.textContent, 10);
            var attempts = localStorage.getItem(`attempts_${number}`);
            if (attempts === 0){
                document.getElementById('control_button_2').style.display = 'none';
                document.getElementById('control_button_3').style.display = 'none';
            }
            document.getElementById('control_button_2').style.display = 'none';
            document.getElementById('control_button_3').style.display = 'none';
            nextBtn.classList.remove('gray_dis');
            nextBtn.disabled = false;
            window.alert("Вы потратили все попытки для прохождения задания, кнопка 'Ответить' заблокированна!!!");
        }
        // ЭТО ДЛЯ ОШИБОК
        function disabvarest(){
            document.getElementById('control_button_2').style.display = 'none';
            document.getElementById('control_button_3').style.display = 'none';
            setTimeout(() => toTheoryPage(), 1);
        }
        function checkAnswer10() {
            var attempts = localStorage.getItem(`attempts_${number}`);
            var correctAnswers = test.filter(item => item.hasOwnProperty('correct_answer_type_10')).map(item => item.correct_answer_type_10)[0];  // получаем первый элемент (внутренний массив)
            // Получаем все элементы с классом 'targetField'
            var elementDiv = document.querySelectorAll('.targetColumn .element_div');
            var allCorrect = true;
            var shouldDecreaseAttempts;
            // Проверяем, что массивы result и correctAnswers имеют одинаковую длину
            if (result.length !== correctAnswers.length) {
                console.error('Массивы должны иметь одинаковую длину.');
                return;
            }
            // Проходим по всем элементам массива
            for (var i = 0; i < result.length; i++) {
                // Получаем элемент targetField для текущего индекса
                var element = elementDiv[i];
                // Проверяем, что элемент существует
                if (element) {
                    // Удаляем предыдущие классы
                    element.classList.remove('correct', 'incorrect');
                    // Сравниваем ответ пользователя с правильным ответом
                    if (result[i] === correctAnswers[i]) {
                        // Если ответ правильный, добавляем класс correct
                        element.classList.add('correct');
                    } else {
                        allCorrect = false;
                        partiallyCorrect = true;
                        // Если ответ неправильный, добавляем класс incorrect
                        element.classList.add('incorrect');
                    }
                    if (!allCorrect && partiallyCorrect){
                        shouldDecreaseAttempts = true; // Устанавливаем флаг для уменьшения попыток
                    };
                } else {
                    console.warn(`Элемент для индекса ${i} не найден.`);
                }
            }
            if (shouldDecreaseAttempts){
                attempts--;
                localStorage.setItem(`attempts_${number}`, attempts.toString());
                if (attempts === 0){
                    disabvarest();
                };
            };
            localStorage.setItem('answer_from_' + index, JSON.stringify({ questionPlace: allCorrect }));
            if(allCorrect){
                backWardBtn.classList.remove('gray_dis');
                backWardBtn.disabled = false;
                nextBtn.classList.remove('gray_dis');
                nextBtn.disabled = false;
            }
            document.getElementById('control_button_2').style.display = 'none';
            document.getElementById('control_button_3').style.display = 'inline-block';
            document.getElementById('control_button_3').classList.remove('hidden');
        };
        // Функция для дебаунсинга (задержка вызова при resize)
        function debounce(func, wait) {
            var timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        };
        function renderPopUp() {
            var mainBody = document.querySelector('#content');
            // Добавляем разметку попапа в тело документа
            mainBody.innerHTML += `
            <div class='popup_type_10 closed'>
                <div class='popup_body_type_10'>
                    <div class='popup_content_type_10'>
                        <div class='popup_text_type_10'>
                            <div class="popup_header_type_10">
                                <h3 class='popup_header_text_type_10'></h3>
                                <button class='close_popup_type_10' onclick='closePopUp()'><img src='./content/close.svg' alt='close'></button>
                            </div>
                            <div class="popup_inner_content_type_10">Контент по умолчанию</div>
                        </div>
                    </div>
                </div>
            </div>`;
        }
        renderPopUp();
        function addZoomBtn() {
            var zoomPlc = document.querySelectorAll('.popup_zoom_plc');
            zoomPlc.forEach((item, index) => {
                // Добавляем кнопку зума в каждый элемент
                item.innerHTML += `<button class='zoom_button' onclick='openPopUp(${index})' id='zoom_button_${index}'><img src='./content/zoom_up.svg' alt='zoom'></button>`;
            });
        }
        openPopUp();
        function updatePositionsOnResize() {
            // Получаем новые размеры и координаты контейнера .mapping
            var planeText = document.querySelector('.test_wrapper_type_10');
            if (planeText) {
                var mappingRect = document.querySelector('.mapping').getBoundingClientRect();
                // Обновляем координаты стартовых полей и их кругов
                for (var i = 1; i <= Object.keys(startPositions).length; i++) {
                    var startField = document.getElementById('startField' + i);
                    var startRect = startField.getBoundingClientRect();
                    var startX = startRect.left - mappingRect.left + startRect.width / 2;
                    var startY = startRect.top - mappingRect.top + startRect.height / 2;
                    // Обновляем позиции стартовых полей
                    startPositions[i] = { x: startX, y: startY };
                    // Если круг не перемещён в таргет-поле
                    if (circleOccupancy[i] === null) {
                        // Круг остается на стартовой позиции
                        circles[i].center(startX, startY);
                        lines[i].plot(startX, startY, startX, startY);
                    } else {
                        // Если круг находится в таргет-поле, пересчитываем позицию таргет-поля
                        var targetFieldId = circleOccupancy[i];
                        var targetField = document.getElementById(targetFieldId);
                        if (targetField) {
                            var targetRect = targetField.getBoundingClientRect();
                            var targetCenterX = targetRect.left - mappingRect.left + targetRect.width / 2;
                            var targetCenterY = targetRect.top - mappingRect.top + targetRect.height / 2;
                            // Перемещаем круг в центр таргет-поля
                            circles[i].center(targetCenterX, targetCenterY);
                            lines[i].plot(startX, startY, targetCenterX, targetCenterY);
                        }
                    }
                }
            }

        };
        // Добавляем обработчик события изменения размера окна с дебаунсингом
        window.addEventListener('resize', debounce(updatePositionsOnResize, 1));
    }
    function openPopUp() {
        var zoomBtn = document.querySelectorAll('.zoom_button');
        var popupWindow = document.querySelectorAll('.popup_type_10');
        var popupWindowPlc = document.querySelector('.popup_inner_content_type_10');
        var popupZoomPlc = document.querySelectorAll('.popup_zoom_plc');
        // Функция для удаления кнопок из содержимого
        function removeButtonsFromContent(content) {
            const contentClone = content.cloneNode(true);
            const buttons = contentClone.querySelectorAll('button');
            buttons.forEach((button) => {
                button.remove(); // Удаляем кнопку из клона
            });
            return contentClone.innerHTML;
        }
        // Установка обработчиков событий для кнопок зума
        zoomBtn.forEach((item, index) => {
            document.getElementById('close_popup_btn').addEventListener('click', () => closePopUp());
            document.getElementById('popup_button_1').addEventListener('click', () => showPopUp());
            item.addEventListener('click', () => {
                console.log(`click_${index}`);
                // Открываем попап и устанавливаем содержимое
                if (index < popupZoomPlc.length) {
                    // Удаляем кнопки из содержимого и устанавливаем его в попап
                    popupWindowPlc.innerHTML = removeButtonsFromContent(popupZoomPlc[index]);
                    // Открываем попап
                    popupWindow.forEach((popup) => {
                        popup.classList.remove('closed');
                    });
                }
            });
        });
    }
    document.querySelector('#control_button_3').onclick = () => {
        document.getElementById('control_button_2').style.display = 'block';
    }
    // Функция для закрытия попапа
    function closePopUp() {
        var popup = document.querySelector('.popup_type_10');
        // Закрываем попап, добавляя класс 'closed'
        popup.classList.add('closed');
    }
    createTest(`index_${currentPageIndex}`);
    function addDescBtnLis(){
        document.querySelector('#popup_button_1').onclick = () => {
            document.querySelector('#popup_window_id').classList.remove('disabled');
        }
        document.querySelector('#close_popup_btn').onclick = () => {
            document.querySelector('#popup_window_id').classList.add('disabled');
        }
    }
    setTimeout(addDescBtnLis(), 100);
}
