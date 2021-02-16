type RustPython = typeof import('rustpython_wasm')

class PythonModule {
  public static mod: RustPython
  static address: String

  public static async initializeWasm() {
    PythonModule.address = window.location.host
    PythonModule.mod = await import('rustpython_wasm')
    let a = `
import pickle
import base64
import browserhelpers
`;
    PythonModule.mod.pyExec(a)
  }

  public static deserializeMessage(message): string {
      (document.getElementById("parsingBuffer") as HTMLInputElement).value = message.data
      
      let a = `
message = browserhelpers.get_attr("#parsingBuffer", "value")
data = base64.b64decode(message.encode())
data = pickle.loads(data)
if data and data.get("message"):
  browserhelpers.set_attr("#parsingBuffer", "value", data["message"])
`;
      PythonModule.mod.pyExec(a)
      return (document.getElementById("parsingBuffer") as HTMLInputElement).value
  }

  public static serializeMessage(message: string) {
    (document.getElementById("parsingBuffer") as HTMLInputElement).value = message

    let a = `
message = browserhelpers.get_attr("#parsingBuffer", "value")
data = pickle.dumps({"message": message})
data = base64.b64encode(data).decode()
browserhelpers.set_attr("#parsingBuffer", "value", data)
`;
    PythonModule.mod.pyExec(a)

    return (document.getElementById("parsingBuffer") as HTMLInputElement).value
  }
}

export default PythonModule;
