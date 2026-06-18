import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function test() {
  const start = Date.now();
  await execAsync(`docker run --rm code-runner-cpp sh -c "echo '#include <iostream>\nusing namespace std;\nint main() { cout << 1; return 0; }' > /tmp/test.cpp && g++ /tmp/test.cpp -o /tmp/out && /tmp/out"`);
  console.log("No limits Time:", Date.now() - start, "ms");
}
test();
