export interface CheatSheetItem {
  id: string;
  title: string;
  content: string;
}

export const cheatSheetData: CheatSheetItem[] = [
  {
    id: 'basic-models',
    title: 'Basic models',
    content: `Original "ChatGPT moment" style models. "Quick answer" models. Input text or media and it directly outputs text or media. \n\n **Important:** All of the modern AI tooling/applications is built on cycles of text in/text out—there is **no** magic beyond this! See [Architecture of AI applications](ai-app-architecture). \n\n Single-shot, multi-shot prompting (see [prompt engineering](prompt-engineering)). \n\n How do they work? See [Models & Inference](models-inference).\n\n  See also: [Reasoning models](reasoning-models), [Model Systems](model-systems)`,
  },
  {
    id: 'models-inference',
    title: 'Models & Inference',
    content: `**Model:** a file containing billions of numbers (weights) that describe the relatedness of word pieces (tokens) to one another, across many dimensions, in a highly-compressed way. Consider e.g. "King, power" and "Kill, poison" and a weight value for the tokens of: "Ki, po" that caters for the connections between both concepts, but also the non-connectedness of "kiss, pool".

**Inference:** Execution of a program that uses a model (weights file), to generate response (token by token) through deep distillation of input tokens + WIP response meaning. E.g. "Dear Chatbot, my name is X, what is my name?". Output distillation layers successively capture token encoded concepts like: \`["formal question response", "name is X"]\` => \`["Dear user", "X"]\` => \`["Dear", "X"]\` => Dear.

**Note:** "Model" frequently refers to the entire inference program + weights file. "The model responded with: X".`,
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt engineering (improving your prompts)',
    content: `- **Google Framework:** Task, Context, References, Evaluation, Iterate. Goes from basic trial/error to advanced model weights based prompt optimisation tooling supported.
- **CLEAR framework:** Context, Limitations, Examples, Actions, Results
- **Devs tasks:** tell the models what you want to achieve, not how to do it.`,
  },
  {
    id: 'context',
    title: 'Context',
    content: `The definition depends on the context 😭.

- in an application development setting the final text sent to models for inference is e.g. user entered text + system prompt (program defined) + conversation history. "Context" can be any part of the final text that informs the response such as "You are a chatbot for XYZ corp", or "I have now successfully logged in".
- It may also refer to all of the final text, e.g. in reference to [context windows](context-window).
- Applications may dynamically add to the context based on user prompts e.g. via [RAG](rag), or context engines, or codebase indexes. Context is also used to enable [tool calling](tool-calling) simply by describing how tool calling works - see [tool calling](tool-calling).`,
  },
  {
    id: 'context-window',
    title: 'Context Window',
    content: 'The maximum tokenised input length supported by the model inference.',
  },
  {
    id: 'rag',
    title: 'RAG (Retrieval Augmented Generation)',
    content: `Before handing input text to a model, query some datasource ("retrieve"), and add the query result to the context to "augment the generation". This can be done directly by the program processing the user prompt, or by letting the model itself decide to call a tool - see [tool calling](tool-calling).

**Example:** User sends prompt: what is the best restaurant in Siciliy? => This prompt is sent to a vector database using "similarity search" (pre ChatGPT moment tech) which returns snippets like "Ristorante Duomo has Two Michelin stars". The final model prompt is "System: utilise the following context when answering the users's query: "Ristorante Duomo has Two Michelin stars". User: What is the best restaurant in Sicily?". Response: Ristorante Duomo, with Two Michelin stars may be considered the best, or one of the best restaurants in Sicily.`,
  },
  {
    id: 'tool-calling',
    title: 'Tool calling',
    content: `A programmatic arrangement between a model and the program described in the context that tells a model to emit structured response text (JSON, XML) which can be used by the program as parameters when calling a native function.

**Example:**
1. Program calls model with: "Context: To find the timezone of a city, respond with \`<tz_finder>{cityName}</tz_finder>\`. User Prompt: "What's the timezone of Sicily"".
2. Model responds: \`<tz_finder>Sicily</tz_finder>\`.
3. Program parses response and calls some \`findTimezone("Sicily")\` function.
4. Program calls model: Conversation history: ["...original message", "tool call", "tool call result: GMT+2"].
5. Model responds: The timezone of Sicily is "GMT+2".

**Note:** In the above example, the program designer has described the programmatic arrangement for tool calling to the model. This is not inappropriate, but the major AI models already include standard tool calling protocols that they inject into AI model prompts, exposed by their apis where you can register the tools you support, and their parameters, to be called in a standard fashion. Most AI SDKs then support auto-handling steps 2,3,4, so that it seems like 1. -> 5. directly.

**Note:** Tool calling can be used for:
- Model directed context expansion (as in above example, where model decides it needs more info). Aka [RAG](rag) via tool calling.
- Performing real world actions e.g. \`{ tool: "sendEmail", params: { subject: "AI", body: "Hi Sam..." } }\`.`,
  },
  {
    id: 'ai-agents',
    title: 'AI Agents',
    content: `Programs that give models context that narrows their responses (and actions via tool-calling)—usually according to some kind of "persona".

**Examples:**
- Chat program with system prompt: "You are a Shopify developer".
- executable program with source code \`while (response !== "task-complete") { callModel("...instructions"); }\`.
- Development agents: Github Copilot, Codex, Cursor's Agent, Claude Code, Gemini CLI, Roo, bolt.new, v0.app, lovable.dev,

**Notes:**
- "agent" can refer specifically to the subclass of programs that call models in a loop towards a goal, displaying open-ended decision making capabilities until the goal is complete. This would exclude the chatbot example above.
- "agent" can also refer to a single model inference. E.g. "The agent decided" refers to the decision making power of the model inference, not the program.`,
  },
  {
    id: 'context-engineering',
    title: 'Context Engineering',
    content: `Is to [AI agents](ai-agents) what [prompt engineering](prompt-engineering) is to AI models. The difference is that prompt text is ALWAYS included in AI model inference, whereas context engineering includes exposing context that is discoverable, e.g. via convention or tool use.

**Example:** "Agent.MD" file in a project is included by many agents, and may contain instructions like "If the task relates to i18n, read i18n.md". The agent will use a file read tool to expand it's context.`,
  },
  {
    id: 'mcp',
    title: 'Model Context Protocol (MCP)',
    content: `A standard mechanism utilisable by **programs** to provide context to AI models.

A program might accept configurations of MCP servers through some JSON file. The program connects to those MCP servers which state "I have these tools, documents, & suggested prompts". The program can then decide to inject that retrieved information into the context when doing model calls. For example: \`tools: [{ "name": "mcp_server_a_tool_name", ....}]\`.

From the end user perspective, MCP is a kind of standardised [context engineering](context-engineering).

**Example:** You can configure your dev agent with the https://context7.com/ MCP server. After this if you are working on a Shopify project, you can ask the agent to query the Shopify docs via context7 before performing a task so it has up to date information.`,
  },
  {
    id: 'dev-agent-features',
    title: 'Features that distinguish Dev Agents',
    content: `- system prompt. See e.g. [bolt.new's prompts.ts]()
- built-in tools - browser, etc.
- Context gathering approach - user driven, RAG using codebase indexes, model driven tool calling based discovery.
- Model selection?
- Edit tracking between prompts (otherwise the the model may revert your changes during subsequent edits).
- Context window compression: otherwise as the conversation history grows, the models can lose focus/forget instructions. Also for cost reduction.
- Workflow: Editor blocking / non-blocking / remote.
- Diffing mechanisms - escapable? (Git is enough!)
- Yolo friendliness. Can you just let the agent go at it without manual intervention?
- multimodal input support (images, figma files).
- use of pre-defined outputs (e.g. orchids.app)`,
  },
  {
    id: 'ai-editor-features',
    title: 'AI features in Editors.../plugins',
    content: `- AI driven autocomplete - speed is configurable!
- Tab to move to next predicted task.
- Inline prompting (AI chat against a single file).
- Agent modes:
   - developer agent
   - ask agents?
   - planning agent?
   - custom agents?`,
  },
  {
    id: 'reasoning-models',
    title: 'Reasoning models',
    content: `Every single feature we've discussed so far could be in relation to "base models" - just direct input text -> response models. Reasoning models really started to come on the scene in 2024. What they do is initially generate text, used to generate more text, used to generate more text, used to then generate *more accurate* response text. They are specifically trained so that the intermediate "reasoning text" output steps will be sensical. It's essentially trying to use language as a vehicle for reasoning. It's one big hack that works, but they are "slow" models.`,
  },
  {
    id: 'model-systems',
    title: 'Model systems',
    content: 'Emerging in 2025, these are agents/chat interfaces that use an intelligent routing system so that you don\'t have to choose between (basic/reasoning) models.',
  },
  {
    id: 'model-sizes',
    title: 'Model sizes',
    content: `- Large models contain greater obscure domain knowledge.
- Smaller models otherwise contain similar levels of "intelligence" for tasks like coding etc.`,
  },
  {
    id: 'calling-ai-models',
    title: 'Calling AI models programatically',
    content: 'Can be done by each vendors API, or via universal SDKs like ai-sdk - be warned: vendor differences still necessarily leak through!',
  },
    {
    id: 'ai-app-architecture',
    title: 'Architecture of AI applications',
    content: `![AI Application Architecture](/aiapparchitecture.png)`,
  },
];
