import WhyNode from "./WhyNode";

/**
 * Converts legacy flat whys array to new tree structure.
 * Flat: ["why1", "why2"]
 * Tree: { text: "why1", children: [{ text: "why2", children: [] }] }
 */
export function whysToTree(whys) {
  if (!Array.isArray(whys) || whys.length === 0) {
    return { text: "", children: [] };
  }

  // Check if first item is already an object (new format)
  if (typeof whys[0] === "object" && whys[0] !== null && !Array.isArray(whys[0])) {
    return whys[0];
  }

  // Convert legacy flat array into a linear chain
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
 * Converts tree structure back to flat whys array for backward compatibility.
 */
export function treeToWhys(tree) {
  if (!tree) return [];
  const result = [];
  let current = tree;
  while (current) {
    if (current.text) result.push(current.text);
    current = current.children && current.children.length > 0 ? current.children[0] : null;
  }
  return result;
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
    return { text: "", children: [] }; // Don't delete root
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