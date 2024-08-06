import React, { useState } from 'react';
import Tree from 'react-d3-tree';
import './TreeVisualizer.css';

const TreeVisualizer = () => {
  const [treeData, setTreeData] = useState([
    {
      name: 'Root',
      attributes: { value: 'root' },
      children: [],
    },
  ]);
  const [parentName, setParentName] = useState('');
  const [nodeName, setNodeName] = useState('');
  const [nodeValue, setNodeValue] = useState('');
  const [traversalResult, setTraversalResult] = useState([]);

  const addNode = (parentNodeName, newNode) => {
    const addNodeRecursive = (node) => {
      if (node.name === parentNodeName) {
        if (!node.children) {
          node.children = [];
        }
        node.children.push(newNode);
      } else if (node.children) {
        node.children.forEach(child => addNodeRecursive(child));
      }
    };

    if (treeData.length === 0 && parentNodeName === '' && nodeName) {
      setTreeData([{ name: nodeName, attributes: { value: nodeValue }, children: [] }]);
    } else {
      const newTreeData = [...treeData];
      newTreeData.forEach(node => addNodeRecursive(node));
      setTreeData(newTreeData);
    }

    setParentName('');
    setNodeName('');
    setNodeValue('');
  };

  const deleteNode = (nodeNameToDelete) => {
    const deleteNodeRecursive = (node, parent = null) => {
      if (node.children) {
        node.children = node.children.filter(child => child.name !== nodeNameToDelete);
        node.children.forEach(child => deleteNodeRecursive(child, node));
      }
    };

    if (treeData.length === 0) return;

    if (treeData[0].name === nodeNameToDelete) {
      setTreeData([]);
    } else {
      const newTreeData = [...treeData];
      newTreeData.forEach(node => deleteNodeRecursive(node));
      setTreeData(newTreeData);
    }
  };

  const handleAddNode = (e) => {
    e.preventDefault();
    if (nodeName && nodeValue) {
      const newNode = { name: nodeName, attributes: { value: nodeValue }, children: [] };
      addNode(parentName, newNode);
    }
  };

  const handleDeleteNode = (e) => {
    e.preventDefault();
    if (nodeName) {
      deleteNode(nodeName);
    }
  };

  const renderCustomNode = ({ nodeDatum }) => (
    <g>
      <circle r="20" style={{ fill: '#90ee90', stroke: '#32cd32', strokeWidth: 1.5 }} />
      <text fill="white" x="0" y="-5" textAnchor="middle" alignmentBaseline="middle" fontSize="12">
        {nodeDatum.name}
      </text>
      <text fill="white" x="0" y="10" textAnchor="middle" alignmentBaseline="middle" fontSize="10">
        {nodeDatum.attributes?.value}
      </text>
    </g>
  );

  const traversePreOrder = (node, result = []) => {
    if (!node) return result;
    result.push(node.name);
    if (node.children) {
      node.children.forEach(child => traversePreOrder(child, result));
    }
    return result;
  };

  const traverseInOrder = (node, result = []) => {
    if (!node) return result;
    if (node.children && node.children[0]) traverseInOrder(node.children[0], result);
    result.push(node.name);
    if (node.children && node.children[1]) traverseInOrder(node.children[1], result);
    return result;
  };

  const traversePostOrder = (node, result = []) => {
    if (!node) return result;
    if (node.children) {
      node.children.forEach(child => traversePostOrder(child, result));
    }
    result.push(node.name);
    return result;
  };

  const handleTraversal = (type) => {
    let result = [];
    if (treeData.length > 0) {
      if (type === 'preOrder') {
        result = traversePreOrder(treeData[0]);
      } else if (type === 'inOrder') {
        result = traverseInOrder(treeData[0]);
      } else if (type === 'postOrder') {
        result = traversePostOrder(treeData[0]);
      }
    }
    setTraversalResult(result);
  };

  return (
    <div className="tree-container">
      <h1>Tree Visualizer</h1>
      <form className="node-form" onSubmit={handleAddNode}>
        <input
          type="text"
          placeholder="Parent Node Name (Leave empty for root)"
          value={parentName}
          onChange={(e) => setParentName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Node Name"
          value={nodeName}
          onChange={(e) => setNodeName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Node Value"
          value={nodeValue}
          onChange={(e) => setNodeValue(e.target.value)}
        />
        <button type="submit">Add Node</button>
      </form>
      <form className="node-form" onSubmit={handleDeleteNode}>
        <input
          type="text"
          placeholder="Node Name to Delete"
          value={nodeName}
          onChange={(e) => setNodeName(e.target.value)}
        />
        <button type="submit">Delete Node</button>
      </form>
      <div className="traversal-buttons">
        <button onClick={() => handleTraversal('preOrder')}>Pre-Order</button>
        <button onClick={() => handleTraversal('inOrder')}>In-Order</button>
        <button onClick={() => handleTraversal('postOrder')}>Post-Order</button>
      </div>
      <div className="traversal-result">
        <h3>Traversal Result:</h3>
        <div className="traversal-array">
          {traversalResult.map((value, index) => (
            <div key={index} className="array-item">
              {value}
            </div>
          ))}
        </div>
      </div>
      <div style={{ width: '100%', height: '60vh' }}>
        <Tree data={treeData} orientation="vertical" renderCustomNodeElement={renderCustomNode} />
      </div>
    </div>
  );
};

export default TreeVisualizer;
