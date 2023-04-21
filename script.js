// import { signal } from "https://cdn.skypack.dev/@preact/signals-core";

function onComposeStart() {
  document.getElementById('bottom_compose_area').classList.add('_open')
  document.getElementById('compose_body_editor_input_bottom').focus()
  window.addEventListener('resize', onDocumentResize)
  updateEditorButtonsScrollShadows()
}

function onDocumentResize() {
  updateEditorButtonsScrollShadows()
  onComposeHeightChange()
}

function onComposeClose() {
  document.getElementById('bottom_compose_area').classList.remove('_open')
  window.removeEventListener('resize', onDocumentResize)
  document.getElementById('bottom_compose_area').classList.remove('_maximized')
  document.getElementById('bottom_compose_area').classList.remove('_enlarged')

}

function onComposeStartNewTopic(e) {
  e.preventDefault()
  e.stopImmediatePropagation()
  document.getElementById('bottom_compose_area').classList.add('_open')
  const topic_input = document.getElementById('compose_to_topic_input_bottom')
  topic_input.value = ''
  topic_input.setAttribute = ''
  topic_input.focus()
}

function onTopicInputFocus() {
  const topic_input = document.getElementById('compose_to_topic_input_bottom')
  topic_input.parentNode.classList.add('_focused')
}

function onTopicInputBlur() {
  const topic_input = document.getElementById('compose_to_topic_input_bottom')
  topic_input.parentNode.classList.remove('_focused')
}
function onTopicInputDown(event) {

  const sel = document.getSelection()
  const topic_input = document.getElementById('compose_to_topic_input_bottom')
  if (topic_input.value != ''
    && sel.toString() != topic_input.value && topic_input != document.activeElement) {
    event?.preventDefault()
    event?.stopImmediatePropagation()

    topic_input.focus()
    topic_input.setSelectionRange(0, -1)
  }
}

//case when clicked on a border but not on the input itself
function onComposeToTopicClick(event) {
  if (event.target instanceof HTMLInputElement === false) {
    onTopicInputDown(event)
  }
}

function onTopicJumpClick() {
  window.scrollTo({ top: 0 })
  document.getElementById('topic_jump_button_bottom').classList.add('_hidden')
}

function onPageScroll() {
  if (window.pageYOffset > 500) {
    document.getElementById('topic_jump_button_bottom').classList.remove('_hidden')
  } else {
    document.getElementById('topic_jump_button_bottom').classList.add('_hidden')
  }
}

function onComposeBodyEditorInputFocus(event) {
  event.target.closest('.compose-body__editor').classList.add('_focused')
}
function onComposeBodyEditorInputBlur(event) {
  event.target.closest('.compose-body__editor').classList.remove('_focused')

  //if the field has only white spaces we remove everything
  // the same should be done for compose_to_dm_input_bottom
  const input_content = event.target.innerText
  if (input_content.trim().length == 0) {
    event.target.innerText = ''
  }
}

function onEditorButtonsWheel(event) {
  // console.log('event', event, 'Math.abs(event.wheelDeltaY) > Math.abs(event.wheelDeltaX)=',Math.abs(event.wheelDeltaY) > Math.abs(event.wheelDeltaX))
  event.stopImmediatePropagation()
  event.preventDefault()
  const target = document.getElementById('compose_body_editor_buttons_scrollable_bottom')
  if (Math.abs(event.wheelDeltaY) > Math.abs(event.wheelDeltaX)) {
    //this is vertical scrolling, we should convert it to horizontal
    const delta = Math.max(Math.abs(event.wheelDeltaY), Math.abs(event.wheelDeltaX))
    target.scrollBy(- Math.sign(event.wheelDeltaY) * delta / 2, 0);
  }else{ //horizontal scrolling
    const delta = -event.wheelDeltaX
    target.scrollBy(delta, 0);
  }
  updateEditorButtonsScrollShadows()
  return false
}

function onEditorButtonsLeftScroll(){
  const scrollable =  document.getElementById('compose_body_editor_buttons_scrollable_bottom')
  const container = document.getElementById('compose_body_editor_buttons_container_bottom')
  scrollable.scrollTo({left:0, behavior:'smooth'})
}
function onEditorButtonsRightScroll(){
  const scrollable =  document.getElementById('compose_body_editor_buttons_scrollable_bottom')
  const container = document.getElementById('compose_body_editor_buttons_container_bottom')
  scrollable.scrollTo({left:scrollable.scrollWidth - scrollable.clientWidth, behavior:'smooth'})
}

function updateEditorButtonsScrollShadows() {
  const container = document.getElementById('compose_body_editor_buttons_container_bottom')
  const scrollable = document.getElementById('compose_body_editor_buttons_scrollable_bottom')

  if (scrollable.scrollWidth > scrollable.clientWidth) {
    if (scrollable.scrollLeft > 4) {
      //_scrollable-left
      container.classList.add('_scrollable-left')
    }
    else {
      container.classList.remove('_scrollable-left')
    }

    if (scrollable.scrollWidth - scrollable.clientWidth - scrollable.scrollLeft > 4) {
      //_scrollable-righ
      container.classList.add('_scrollable-right')
    }
    else {
      container.classList.remove('_scrollable-right')
    }
  } else {
    container.classList.remove('_scrollable-left')
    container.classList.remove('_scrollable-right')
  }
}

const numberFormatter = new Intl.NumberFormat('en-EN') //local should be correct here
const warningCharLimit = 9000
const errorCharLimit = 10000

function onComposeBodyEditorInputChange(event) {
  if (event.target.innerText.length >= warningCharLimit) {
    const char_counter = document.getElementById('char_counter_value_bottom')
    document.getElementById('char_counter_value_limit').innerHTML = '/\xa0' + numberFormatter.format(errorCharLimit)
    char_counter.innerHTML = numberFormatter.format(event.target.textContent.length)
    document.getElementById('compose_body_editor_bottom').classList.add('_warning')

    document.getElementById('compose_banner_warning').classList.add('_open') //banner demo

    if (event.target.innerText.length <= errorCharLimit) {
      document.getElementById('char_counter_value_bottom').classList.remove('_error')
      document.getElementById('compose_body_editor_bottom').classList.remove('_error')
      
      document.getElementById('compose_banner_error').classList.remove('_open') //banner demo
    } else {
      document.getElementById('compose_body_editor_bottom').classList.remove('_warning')
      document.getElementById('compose_body_editor_bottom').classList.add('_error')
      document.getElementById('char_counter_value_bottom').classList.add('_error')

      document.getElementById('compose_banner_warning').classList.remove('_open') //banner demo
      document.getElementById('compose_banner_error').classList.add('_open') //banner demo
    }
    document.getElementById('char_counter_bottom').classList.add('_visible')
  } else {
    document.getElementById('char_counter_bottom').classList.remove('_visible')
    document.getElementById('compose_body_editor_bottom').classList.remove('_warning')
    document.getElementById('compose_body_editor_bottom').classList.remove('_error')

    document.getElementById('compose_banner_warning').classList.remove('_open') //banner demo
    document.getElementById('compose_banner_error').classList.remove('_open') //banner demo
  }
  onComposeHeightChange()
}

function onComposeBodyEditorExpand(event) {
  const area = document.getElementById('bottom_compose_area')
  if (area.classList.contains('_maximized')){  //minimizing
    // we want to animate height, but the end height is unknown
    // we are going to do the best attempt by animating maxHeight down to 50vh
    area.animate([
      {'maxHeight':'calc(100vh - 42px)' },
      {'maxHeight':'50vh' },
    ],{
      duration: 100,
      'animation-fill-mode':'forwards'
    })
    setTimeout(()=>{
      area.classList.remove('_maximized')
      onComposeHeightChange()
    },100)
  } else if(
    area.classList.contains('_enlarged') 
    || area.classList.contains('_almost_enlarged') 
  ){ //maximizing
    area.classList.remove('_enlarged') 
    area.classList.remove('_almost_enlarged')
    area.classList.add('_maximized') 
  } else { //enlarging
    area.classList.remove('_almost_enlarged')
    // before adding _enlarged class we want to animate height
    // but browser can't animate it from an unknon state, so we are going to animate it via js 
    // and finish with setting the same value via css with _enlarged
    const vh50 = window.innerHeight/2
    const areaCurrentHeight = area.clientHeight
    area.animate([
      {'height':areaCurrentHeight+'px' },
      {'height':vh50+'px' },
    ],{
      duration: 150,
      'animation-fill-mode':'forwards'
    })
    setTimeout(()=>{
      area.classList.add('_enlarged')
    },150) //duration of the animation for height transition
     
  }
  document.getElementById('compose_body_editor_input_bottom').focus()
}

//we should track size of the area and switch enlargement button
//otherwise we might be in a situation what we enlarging content area
//but the change isn't visible since the area already grew to such size
const ALMOST_ENLRGED_COMPOSE_HEIGHT_DELTA = 20
function onComposeHeightChange(){
  const area = document.getElementById('bottom_compose_area')
  if (!area.classList.contains('_maximized') && !area.classList.contains('_enlarged')){ 
    // we only care for the case when it is not maximized or enlarged
    // but grew close to _enlarged, which is 50vh
    const vh50 = window.innerHeight/2
    const areaCurrentHeight = area.clientHeight
    if( vh50-areaCurrentHeight <= ALMOST_ENLRGED_COMPOSE_HEIGHT_DELTA ){ //the basic line height is 19px
      area.classList.add('_almost_enlarged')
    }else{
      area.classList.remove('_almost_enlarged')
    }
  }
}

function onComposeToStreamClick() {
  const icon = document.getElementById('compose_to_stream_icon_bottom')
  const label = document.getElementById('compose_to_stream_label_bottom')
  const compose_to_container = document.getElementById('compose_to_container_bottom')
  const to_topic_element = document.getElementById('compose_to_topic_bottom')
  const to_dm_element = document.getElementById('compose_to_dm_bottom')

  const drafts_counters = document.querySelectorAll('.drafts-counter')

  if (icon.classList.contains('icon-hash')) {
    //switch to dm
    icon.classList.remove('icon-hash')
    icon.classList.add('icon-dm')
    label.innerHTML = 'DM'
    compose_to_container.classList.add('_dm')

    drafts_counters.forEach(el=>{
      el.style.display='none'
    })
  } else {
    icon.classList.remove('icon-dm')
    icon.classList.add('icon-hash')
    label.innerHTML = 'Some stream'
    compose_to_container.classList.remove('_dm')

    // example of the case when we have some drafts in a stream topic
    // so we show counter
    drafts_counters.forEach(el=>{
      el.style.display='block'
    })
  }

}

function onComposeToDmBottomClick() {
  document.getElementById('compose_to_dm_bottom').classList.add('_focused')
  document.getElementById('compose_to_dm_input_bottom').focus()
  document.addEventListener('click', onClickOutsideDmClick)
}
function onClickOutsideDmClick(event) {
  const compose_el = document.getElementById('compose_to_dm_bottom')
  if (!compose_el.contains(event.target)) {
    onComposeToDmBlur()
  }
}
function onComposeToDmBlur(){
  const compose_el = document.getElementById('compose_to_dm_bottom')
  compose_el.classList.remove('_focused')
  document.removeEventListener('click', onClickOutsideDmClick)
}

function onThemeSwitcherClick(){
  document.body.classList.toggle('dark')
}

function onSendOptionsClick(){
  document.getElementById('send_options_menu_bottom').classList.toggle('_open')
}

function onSendClick(){
  document.getElementById('compose_banner_info').classList.add('_open')
  document.getElementById('compose_banner_success').classList.add('_open')
}

function onCloseBannerClick(element_id){
  document.getElementById(element_id).classList.remove('_open')
}