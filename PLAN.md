# Plan: Consolidate Toolset Decision Criteria

This plan outlines the steps to consolidate the decision criteria from meta-tools.ts into the TOOL_SETS record in toolSets.ts.

## To-Do List

- [x] Update the ToolSetDefinition interface to include decisionCriteria field
    - *Added decisionCriteria field to ToolSetDefinition interface*
- [x] Add decision criteria to each toolset in the TOOL_SETS record
    - *Added decisionCriteria field to all 24 toolsets in the TOOL_SETS record*
- [x] Update the generateToolsetDescriptionList function to use the consolidated data
    - *Removed separate decisionCriteria mapping and updated function to use TOOL_SETS[toolset].decisionCriteria*
- [x] Remove the separate decisionCriteria mapping from meta-tools.ts
    - *Already completed when updating generateToolsetDescriptionList function*
- [x] Test the changes to ensure functionality is preserved
    - *TypeScript compilation successful, no linter errors remaining* 