import type { Register } from 'claude-code'

export const RULES = `When summarizing this conversation for compaction:
- Keep verbatim the user's explicit instructions and corrections, all of them.
- Keep verbatim what the remaining work needs: IDs, \`file:line\`, commands, numbers, error text.
- Keep every live decision with its why; a superseded one gets one line naming what replaced it. Keep open questions open; never mark an undecided option as decided.
- Keep: current task, done-criteria, done vs pending, the exact next action.
- Compress dead ends to one line each: what was ruled out and why.
- Point to plans and logs on disk by path instead of restating them.
- A handoff written this session: keep its content. The hook may not re-inject it, and it moves the file to an archive.`

// The user's /compact focus stays first; the rules follow it rather than replace it.
export const withRules = (focus?: string) => (focus?.trim() ? `${focus}\n\n${RULES}` : RULES)

export const register: Register = on => {
  on('session.compact', async ($, e, next) => {
    // Subagent and fork transcripts carry no user instructions or handoff to keep.
    if (e.agentId !== undefined) return next(e)
    return next({ ...e, instructions: withRules(e.instructions) })
  })
}
