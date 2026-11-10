import { expect, test } from 'claude-code/testing'

import { RULES, withRules } from '../hooks/register'

const MSGS = [{ role: 'user' as const, text: 'hi', toolUses: [] }]

test('the /compact focus stays first and the rules follow it', () => {
  expect(withRules()).toBe(RULES)
  expect(withRules('  ')).toBe(RULES)
  expect(withRules('the plan')).toBe(`the plan\n\n${RULES}`)
})

test('a main-conversation compaction hands the summarizer the rules', async ($, on) => {
  const seen: (string | undefined)[] = []
  on('session.compact', (_$, e) => (seen.push(e.instructions), { messages: MSGS }))

  await $.session.compact({ trigger: 'auto', messages: MSGS })
  await $.session.compact({ trigger: 'manual', messages: MSGS, instructions: 'the plan' })

  expect(seen).toEqual([RULES, `the plan\n\n${RULES}`])
})

test("a subagent's compaction passes through untouched", async ($, on) => {
  const seen: (string | undefined)[] = []
  on('session.compact', (_$, e) => (seen.push(e.instructions), { messages: MSGS }))

  await $.session.compact({ trigger: 'auto', messages: MSGS, agentId: 'sub-1' })

  expect(seen).toEqual([undefined])
})
