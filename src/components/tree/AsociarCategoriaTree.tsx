import { useState, useEffect } from "react";
import { Tree, Button, message } from "antd";
import { CheckOutlined } from '@ant-design/icons';

const { TreeNode } = Tree;

type Category = {
  id: number;
  denominacion: string;
  eliminado?: boolean;
  subCategoriaDtos?: Category[];
  subSubCategoriaDtos?: Category[];
  sucursalId?: string;
};

type CategoryInputProps = {
  selectedEmpresa: string | null;
  selectedSucursal: string | null;
};

const ArbolCategoriaPorSucursal: React.FC<CategoryInputProps> = ({ selectedEmpresa, selectedSucursal }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [updateKey, setUpdateKey] = useState<number>(Date.now());

  useEffect(() => {
    if (selectedEmpresa && selectedSucursal) {
      console.log("Empresa seleccionada:", selectedEmpresa);  // Debugging
      console.log("Sucursal seleccionada:", selectedSucursal);  // Debugging
      fetchCategories();
    }
  }, [selectedEmpresa, selectedSucursal, updateKey]);

  const fetchCategories = async () => {
    try {
      if (!selectedEmpresa || !selectedSucursal) return;

      const url = `http://localhost:8080/api/local/traerCategoriasNoAsociadasASucursal/${selectedSucursal}/${selectedEmpresa}`;
      console.log("Fetching categories with URL:", url);  // Debugging URL
      const response = await fetch(url);
      const data: Category[] = await response.json();

      const sortedData = data.sort((a, b) => a.id - b.id);
      setCategories(sortedData);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  const handleAsociar = async (categoriaId: number) => {
    if (!selectedSucursal) return;

    try {
      const url = `http://localhost:8080/api/local/agregarSucursalACategoria/${categoriaId}/${selectedSucursal}`;
      const response = await fetch(url, { method: 'POST' });

      if (response.ok) {
        message.success('Categoría asociada exitosamente');
        // Trigger a refresh of the categories
        setUpdateKey(Date.now());
      } else {
        message.error('Error al asociar la categoría');
      }
    } catch (error) {
      console.error('Error al asociar la categoría:', error);
      message.error('Error al asociar la categoría');
    }
  };

  const renderTreeNodes = (data: Category[]): React.ReactNode =>
    data.map((item) => (
      <TreeNode
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ textDecoration: item.eliminado ? 'line-through' : 'none' }}>
              {item.denominacion}
            </span>
            <Button 
              type="primary" 
              icon={<CheckOutlined />}
              onClick={() => handleAsociar(item.id)}
            >
              Asociar
            </Button>
          </div>
        }
        key={item.id}
        style={{ color: item.eliminado ? 'gray' : 'inherit' }}
      >
        {item.subCategoriaDtos && renderTreeNodes(item.subCategoriaDtos)}
        {item.subSubCategoriaDtos && renderTreeNodes(item.subSubCategoriaDtos)}
      </TreeNode>
    ));

  return (
    <div>
      <Tree>{renderTreeNodes(categories)}</Tree>
    </div>
  );
};

export default ArbolCategoriaPorSucursal;
