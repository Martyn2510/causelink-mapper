import WhyNode from "./WhyNode";

/**
 * Converts legacy flat whys array to tree structure.
 * New format: whys[0] is a JSON string of the full tree.
 * Legacy format: ["why1", "why2"] → linear chain.
 */
export function whysToTree(whys) {
  if (!Array.isArray(whys) || whys.length === 0) {
    return { text: "", children: [] };
  }

  // Try JSON tree format (new)
  try {
    const parsed = JSON.parse(whys[0]);
    if (parsed && typeof parsed === "object" && "text" in parsed) {
      return parsed;
    }
  } catch (e) {
    // Not JSON, fall through to legacy format
  }

  // Legacy flat array — convert into a linear chain
  let tree = { text: whys[0] || "", children: [] };
  let current = tree;
  for (let i = 1; i < whys.length; i++) {
    const next = { text: whys[i] || "", children: [] };
    current.children = [next];
    current = next;
  }
  return tree;
}

/**
 * Serializes the full tree to a JSON string for storage.
 * Preserves branching structure and empty texts.
 */
export function treeToWhys(tree) {
  if (!tree) return [];
  return [JSON.stringify(tree)];
}

/**
 * Counts all nodes in the tree (for the max-why limit).
 */
export function countTreeNodes(tree) {
  if (!tree) return 0;
  let count = 1;
  if (tree.children) {
    tree.children.forEach((c) => {
      count += countTreeNodes(c);
    });
  }
  return count;
}

/**
 * Recursively updates a node's text at a given path.
 */
export function updateNodeText(tree, path, newText) {
  if (path.length === 0) {
    return { ...tree, text: newText };
  }
  const [head, ...rest] = path;
  const children = (tree.children || []).map((child, idx) =>
    idx === head ? updateNodeText(child, rest, newText) : child
  );
  return { ...tree, children };
}

/**
 * Adds a child node at a given path.
 */
export function addChildAtPath(tree, path) {
  if (path.length === 0) {
    return { ...tree, children: [...(tree.children || []), { text: "", children: [] }] };
  }
  const [head, ...rest] = path;
  const children = (tree.children || []).map((child, idx) =>
    idx === head ? addChildAtPath(child, rest) : child
  );
  return { ...tree, children };
}

/**
 * Deletes a node at a given path.
 */
export function deleteNodeAtPath(tree, path) {
  if (path.length === 0) {
    return { text: "", children: [] }; // Don't delete root — reset it
  }
  if (path.length === 1) {
    return {
      ...tree,
      children: (tree.children || []).filter((_, idx) => idx !== path[0]),
    };
  }
  const [head, ...rest] = path;
  const children = (tree.children || []).map((child, idx) =>
    idx === head ? deleteNodeAtPath(child, rest) : child
  );
  return { ...tree, children };
}

export { WhyNode };