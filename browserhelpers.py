import browser

def set_attr(selector, attribute, value):
  a = browser.document.query(selector)
  if a:
    a.set_attr(attribute, value)

def get_attr(selector, attribute):
  a = browser.document.query(selector)
  if a:
    return a.get_attr(attribute)
  else:
    return None
