# compact-instructions

A Claude Code mod that appends standing rules to the summarizer's instructions on every main-conversation compaction, `/compact` and auto-compact alike.

The rules keep verbatim the user's instructions and corrections, IDs, `file:line`, commands, numbers and error text; keep live decisions with their why, the current task, done-criteria and the next action; compress dead ends to one line; point to plans and logs by path; and keep a handoff written this session. The full text is `RULES` in `hooks/register.ts`.

- A `/compact <focus>` stays first; the rules follow it.
- Subagent and fork compactions are left as they are.
- The handoff line assumes the `handoff` skill's behavior: its hook may not re-inject the handoff and moves the file to an archive.

## Install

List the folder in `env.CLAUDE_CODE_PLUGIN_DIRS` in `~/.claude/settings.json` (`;`-separated absolute paths on Windows). It loads in every new session.

## Develop

```
claude plugin validate .
claude plugin test .
```

`tsconfig.json` extends `.claude-plugin/types/`, an engine-generated folder that ignores itself. Neither `claude -p` nor `claude plugin test` creates it, so a fresh clone shows editor type errors until it exists; the tests run without it.
