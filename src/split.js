import * as std from "quickjs:std";
import * as os from "quickjs:os";

if (os.isatty(std.in.fileno())) {
  std.err.puts("Pipe into this program to split data by a delimiter\n");
  std.exit(1);
}

const input = std.in.readAsString();

function getDelim() {
  const args = scriptArgs.slice(1);
  const argsString = args.join(" ");

  if (argsString.length == 0) {
    return /\s+/g;
  }

  if (argsString.match(/^\\[bfnrtv]$/)) {
    const value = new Function(`return "${argsString}"`)();
    return value;
  }

  try {
    switch (argsString[0]) {
      case `'`:
      case `"`:
      case `/`: {
        const value = new Function(`return ${argsString}`)();
        return value;
      }
    }
  } catch (err) {
    // ignored
  }

  return argsString;
}

const delim = getDelim();
const result = input.split(delim);

std.out.puts(JSON.stringify(result, null, 2) + "\n");
